const { expect } = require("chai"); 
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function (){

    let NFT;
    let nft;
    // let Marketplace;
    // let marketplace;
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 1;
    let URI = "sample URI";

    beforeEach(async function (){
        NFT = await ethers.getContractFactory("NFT");
        // Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();

        nft = await NFT.deploy(feePercent);
        // marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function () {

        it("Should track name and symbol of the nft collection", async function (){
            const nftName = "TicketContract";
            const nftSymbol = "TICKET";
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the Marketplace", async function (){
            expect(await nft.cuentaMaestra()).to.equal(deployer.address);
            expect(await nft.porcentajeReventa()).to.equal(feePercent);
        });
    });

    describe("Minting NFTs", function (){

        it("Should track each minted NFT", async function (){
            await nft.connect(addr1).mint(URI, "Nuevo NFT", 10);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI, "Segundo NFT", 15);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });

    describe("Making marketplace items", function (){

        let price = 1;
        let result;

        //beforeEach(async function (){
          //  await nft.connect(addr1).mint(URI, "Nuevo NFT", toWei(price));
            // await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        //});

        it("Should track newly created NFTF", async function(){
            await expect(nft.connect(addr1).mint(URI, "Nuevo NFT", toWei(price)))
            .to.emit(nft, "Offered")
            .withArgs(
                1,                
                toWei(price),
                addr1.address
            );

            expect(await nft.ownerOf(1)).to.equal(addr1.address);
            expect(await nft.tokenCount()).to.equal(1)

            const ticekt = await nft.entradas(1);
            expect(ticekt.idEntrada).to.equal(1);
            expect(ticekt.descripcion).to.equal("Nuevo NFT");
            expect(ticekt.precio).to.equal(toWei(price));            
        });

        it("Should fail if price is set to zero", async function (){
            await expect(nft.connect(addr1).mint(
                URI, "Nuevo NFT", 0)).to.be.revertedWith("Price must be greater than zero");
            });
    });

    describe("Purchasing Tickets", function (){

        let price = 2;
        let fee = (feePercent/100)*price;
        let totalPriceInWei;

        beforeEach(async function(){
            await nft.connect(addr1).mint(URI, "Nuevo NFT", toWei(price));
            await nft.connect(addr1).setApprovalForAll(nft.address, true);            
        });

        it ("Should update item as sold, pay seller, transfer to buyer...", async function(){
            const sellerInitialEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();

            totalPriceInWei = await nft.getTotalPrice(1);
            await expect(nft.connect(addr2).sellTicket(1, {value:totalPriceInWei} ))
            .to.emit(nft, "Bought")
            .withArgs(
                1,
                toWei(price),
                addr1.address,
                addr2.address                
            );
            
            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();

            expect((await nft.ticketSold(1))).to.equal(true);
            // expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitialEthBal));
            // expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal));
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        });
    });

})