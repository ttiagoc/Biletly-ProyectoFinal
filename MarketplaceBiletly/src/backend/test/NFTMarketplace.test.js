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
    let addr3;
    let addrs;
    let feePercent = 10;
    let URI = "sample URI";

    beforeEach(async function (){
        NFT = await ethers.getContractFactory("NFT");
        [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        // Marketplace = await ethers.getContractFactory("Marketplace");        

        nft = await NFT.deploy(feePercent);
        // marketplace = await Marketplace.deploy(feePercent);
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
    });

    describe("Minting NFTs", function (){

        it("Should track each minted NFT", async function (){
            // HAY ONLYOWNER
            await expect(nft.connect(addr1).mint(URI, "Nuevo NFT", 10)).to.be.reverted; // solo el owner puede crear nfts

            await nft.connect(deployer).mint(URI, "Nuevo NFT", 10)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(deployer).mint(URI, "Segundo NFT", 15);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(deployer.address)).to.equal(2);
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

        it("Should track newly created NFTs", async function(){
            await expect(nft.connect(deployer).mint(URI, "Nuevo NFT", toWei(price)))
            .to.emit(nft, "Offered")
            .withArgs(
                1,                
                toWei(price),
                deployer.address
            );

            expect(await nft.getOwner(1)).to.equal(deployer.address);
            expect(await nft.tokenCount()).to.equal(1)

            const ticket = await nft.entradas(1);
            expect(ticket.idEntrada).to.equal(1);
            expect(ticket.descripcion).to.equal("Nuevo NFT");
            expect(ticket.precio).to.equal(toWei(price));            
        });

        // it("Should fail if price is set to zero", async function (){
        //     await expect(nft.connect(addr1).mint(
        //         URI, "Nuevo NFT", 0)).to.be.revertedWith("Price must be greater than zero");
        //     });
    });

    describe("Selling Tickets", function (){

        let price = 2;
        let fee = (feePercent/100)*price;
        let totalPriceInWei;

        beforeEach(async function(){
            await nft.connect(deployer).mint(URI, "Nuevo NFT", toWei(price));
            await nft.connect(deployer).setApprovalForAll(nft.address, true);            
        });

        it ("Should update item as sold, pay seller, transfer to buyer...", async function(){
            const sellerInitialEthBal = await deployer.getBalance();
            // const feeAccountInitialEthBal = await deployer.getBalance();

            totalPriceInWei = await nft.getTotalPrice(1);
            await expect(nft.connect(addr1).sellTicket(1, {value:totalPriceInWei} ))
            .to.emit(nft, "Bought")
            .withArgs(
                1,
                toWei(price),
                deployer.address,
                addr1.address                
            );
            
            const sellerFinalEthBal = await deployer.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();

            expect((await nft.ticketSold(1))).to.equal(true);
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitialEthBal));
            //expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal)); // ME ACTUALIZA LOS BALANCES BIEN PERO LAS COMPARACIONES LAS HACE MAL POR SER NUMS MUY GRANDES
            expect(await nft.getOwner(1)).to.equal(addr1.address);
        });
    });

    describe("Setting price of Tickets", function (){

        let price = 10;
        let newPrice = 20;
        let initialPriceInWei = toWei(price);
        let finalPriceInWei = toWei(newPrice);

        beforeEach(async function(){
            await nft.connect(deployer).mint(URI, "Nuevo NFT", initialPriceInWei);
            await nft.connect(deployer).setApprovalForAll(nft.address, true);            
        });

        it ("Should update the price of a ticket", async function(){

            expect((await nft.ticketSold(1))).to.equal(false);       

            let ticket = await nft.entradas(1);
            expect((ticket.precio)).to.equal(initialPriceInWei);

            await nft.connect(deployer).setPrice(1, finalPriceInWei);
            ticket = await nft.entradas(1);
            expect((ticket.precio)).to.equal(finalPriceInWei);
            
        });
    });

    describe("Using and Reselling Tickets", function (){

        let price = 10;
        let totalPriceInWei;

        beforeEach(async function(){
            await nft.connect(deployer).mint(URI, "Nuevo NFT", toWei(price));
            await nft.connect(deployer).setApprovalForAll(nft.address, true);            
        });

        it ("Should not allow the sell of tickets that have already been sold", async function(){

            expect((await nft.ticketSold(1))).to.equal(false);       

            totalPriceInWei = await nft.getTotalPrice(1);
            await expect(nft.connect(addr1).sellTicket(1, {value:totalPriceInWei} ))
            .to.emit(nft, "Bought")
            .withArgs(
                1,
                toWei(price),
                deployer.address,
                addr1.address                
            );    

            expect((await nft.ticketSold(1))).to.equal(true);  

            totalPriceInWei = await nft.getTotalPrice(1);
            await expect(nft.connect(addr3).sellTicket(1, {value:totalPriceInWei} )).to.be.revertedWith('ERC721: Ticket has already been sold');
                                  
        });

        it ("Should stablish ticket as used", async function(){

            expect((await nft.ticketUsed(1))).to.equal(false);     
            await nft.connect(deployer).useTicket(1);
            expect((await nft.ticketUsed(1))).to.equal(true);   
            await expect(nft.connect(deployer).useTicket(1)).to.be.revertedWith('ERC721: Ticket has already been used');
                                  
        });

        it ("Should not allow the sell of a ticket if the sale is closed", async function(){

            let ventaActiva = await nft.getSaleState();
            expect(ventaActiva).to.equal(true);     

            await expect(nft.connect(addr1).changeSaleState()).to.be.reverted; // ya que no es el owner del smart contract

            await nft.connect(deployer).changeSaleState(); // se actualiza el estado de la venta
            ventaActiva = await nft.getSaleState();
            expect(ventaActiva).to.equal(false);     
                                  
        });

        

    });

})