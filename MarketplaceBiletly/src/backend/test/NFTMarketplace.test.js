const { expect } = require("chai"); 
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function (){

    let NFT;
    let nft;
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 1000; // 10% - royaltyPercent
    let URI = "sample URI";

    let evento1 = {
        idEvento:1,
        fecha:"22/3/4",
        nombre:"Evento",
        descripcion:"Un Evento"
    }

    beforeEach(async function (){
        NFT = await ethers.getContractFactory("NFT");
        [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();        

        nft = await NFT.deploy(feePercent);
    });    

    describe("Deployment", function () {

        it("Should track name and symbol of the nft collection", async function (){
            const nftName = "NFTicket";
            const nftSymbol = "TICKET";
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the NFT Contract", async function (){
            expect(await nft.cuentaMaestra()).to.equal(deployer.address);
            expect(await nft.porcentajeReventa()).to.equal(feePercent);
        });

        it("Should support the ERC721 and ERC2198 standards", async () => {            
            const ERC721InterfaceId = "0x80ac58cd";
            const ERC2981InterfaceId = "0x2a55205a";            
            expect(await nft.supportsInterface(ERC721InterfaceId)).to.equal(true);
            expect(await nft.supportsInterface(ERC2981InterfaceId)).to.equal(true);

        });
    });

    describe("Minting NFTs", function (){

        it("Should track each minted NFT", async function (){
            // HAY ONLYOWNER
            await expect(nft.connect(addr1).mint(addr1.address, URI, "Nuevo NFT", evento1)).to.be.reverted; // solo el owner puede crear nfts

            await nft.connect(deployer).mint(addr1.address, URI, "Nuevo NFT", evento1)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(deployer).mint(addr1.address, URI, "Segundo NFT", evento1)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr1.address)).to.equal(2);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });

    describe("Minting NFTs with royalties", function (){

        beforeEach(async function(){
            await nft.connect(deployer).mint(addr1.address, URI, "Nuevo NFT", evento1)
            await nft.connect(deployer).mint(addr2.address, URI, "Segundo NFT", evento1) 
            // await nft.connect(addr1).setApprovalForAll(deployer.address, true);      
            // await nft.connect(addr2).setApprovalForAll(deployer.address, true);
        });

        it ("Mint two tokens and set two different royalties", async function(){

            const token1Royalty = await nft.getRaribleV2Royalties(1);
            const token2Royalty = await nft.getRaribleV2Royalties(2);
            expect(token1Royalty[0][1]).to.equal(feePercent); // token0Royalty[0][1] toma el porcentaje de reventa
            expect(token2Royalty[0][1]).to.equal(feePercent);
            expect(token1Royalty[0][0]).to.equal(deployer.address); // token0Royalty[0][1] toma la cuenta que recibe el porcentaje de reventa
            expect(token2Royalty[0][0]).to.equal(deployer.address);
            //

            const defaultRoyaltyInfo = await nft.royaltyInfo(1, 1000);
            var tokenRoyaltyInfo = await nft.royaltyInfo(2, 50);
            const owner = await nft.owner.call();
            expect(defaultRoyaltyInfo[0]).to.equal(owner); // Default receiver is the owner
            expect(defaultRoyaltyInfo[1].toNumber()).to.equal(100);// Royalty fee is 10%
            expect(tokenRoyaltyInfo[0]).to.equal(owner);
            expect(tokenRoyaltyInfo[1].toNumber()).to.equal(5);
            
        });

        it ("Should track data of newly created NFTs", async function(){
           
            expect(await nft.getOwner(1)).to.equal(addr1.address);
            expect(await nft.tokenCount()).to.equal(2);
            expect((await nft.ticketSold(1))).to.equal(false);  

            const ticket = await nft.entradas(1);
            expect(ticket.idEntrada).to.equal(1);
            expect(ticket.descripcion).to.equal("Nuevo NFT");
            
        });

        it ("Transfer NFTs", async function(){          
            
            expect((await nft.ticketSold(1))).to.equal(false); 
            await nft.connect(deployer).transferFrom(addr1.address, addr2.address, 1);
            expect((await nft.ticketSold(1))).to.equal(true);  
            expect(await nft.getOwner(1)).to.equal(addr2.address);
            expect(await nft.balanceOf(addr2.address)).to.equal(2);
            
        });
    });    

    describe("Using Tickets", function (){

        let price = 10;
        let totalPriceInWei;
        let idEvento = 1;

        beforeEach(async function(){
            await nft.connect(deployer).mint(addr1.address, URI, "Nuevo NFT", evento1)
            // await nft.connect(addr1).setApprovalForAll(deployer.address, true);     
        });        

        it ("Should stablish ticket as used", async function(){

            expect((await nft.ticketUsed(1))).to.equal(false);     
            await nft.connect(addr1).useTicket(1, idEvento);
            expect((await nft.ticketUsed(1))).to.equal(true);   
            await expect(nft.connect(addr1).useTicket(1, idEvento)).to.be.revertedWith('ERC721: Ticket has already been used');
                                  
        });              
        
    });

})