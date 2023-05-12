// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable, ReentrancyGuard {

    uint public tokenCount;
    uint public porcentajeReventa;
    address payable public cuentaMaestra;
    bool private _ventaActiva;

    struct Entrada {
        uint idEntrada;
        string descripcion;
        uint precio;
    }

    mapping(uint => Entrada) public entradas;  
    mapping(uint => bool) private _entradaVendida;
    mapping(uint => address) private _propietarioEntrada;
    mapping(uint => bool) private _entradaUtilizada;

    constructor(uint _porcentajeReventa) ERC721("TicketContract", "TICKET"){
        porcentajeReventa = _porcentajeReventa;
        cuentaMaestra = payable(msg.sender);
        _ventaActiva = true;
    }

    event Bought(
        uint idEntrada,
        uint precio,
        address indexed vendedor,
        address indexed comprador
    );

    function mint(string memory _tokenURI, string memory _descripcion, uint _precio) external onlyOwner nonReentrant returns(uint){

        tokenCount++;
        require(_precio > 0, "Price must be greater than zero");
        require(!_exists(tokenCount), "Ticket already exists");
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        
        Entrada memory attributes;
        attributes.idEntrada = tokenCount;
        attributes.descripcion = _descripcion;
        attributes.precio = _precio;
        entradas[tokenCount] = attributes;

        _entradaVendida[tokenCount] = false;
        _propietarioEntrada[tokenCount] = msg.sender;

        return tokenCount;
    }

    function setPrice(uint256 _tokenId, uint256 _newPrice) external {
        require(_exists(_tokenId), "Ticket does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the ticket owner");
        entradas[_tokenId].precio = _newPrice;
    }

    function sellTicket(uint256 _tokenId) external payable nonReentrant {
        require(_exists(_tokenId), "Ticket does not exist");
        require(msg.value >= getTotalPrice(_tokenId), "Insufficient payment");    
        require(!(_entradaVendida[_tokenId]), "Ticket has already been sold");    
        require(_ventaActiva == true, "Ticket sale is close");

        address previousOwner = ownerOf(_tokenId);
        address payable newOwner = payable(msg.sender);
        uint256 salePrice = entradas[_tokenId].precio;
        uint256 resaleFee = (salePrice * porcentajeReventa) / 100;

        _transfer(previousOwner, newOwner, _tokenId);
        _entradaVendida[_tokenId] = true;
        _propietarioEntrada[_tokenId] = newOwner;

        payable(previousOwner).transfer(salePrice - resaleFee);
        payable(owner()).transfer(resaleFee);
        
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }

        emit Bought(
            _tokenId,
            salePrice,
            previousOwner,
            newOwner
        );
    }

    function useTicket(uint _tokenId) external returns (bool) {
        require(_exists(_tokenId), "Ticket does not exist");
        require(ticketUsed(_tokenId), "Ticket has already been used");    
        _entradaUtilizada[_tokenId] = true;    
        return true;
    }

    function ticketSold(uint _tokenId) public view returns (bool) {
        return _entradaVendida[_tokenId];
    }

    function ticketUsed(uint _tokenId) public view returns (bool) {
        return _entradaUtilizada[_tokenId];
    }

    function getOwner(uint _tokenId) public view returns (address){
        return ownerOf(_tokenId);        
    }

    function getTotalPrice(uint _tokenId) public view returns(uint) {
        return ((entradas[_tokenId].precio*(100 + porcentajeReventa))/100);        
    }

    function changeSaleState(bool estado) public onlyOwner{
        _ventaActiva = estado;
    }
    
    //HACER WITHDRAW
     

    // function getTicketAttributes(uint256 _tokenId)
    //     external
    //     view
    //     returns (
    //         string memory,
    //         uint,
    //         uint
    //     )
    // {
    //     require(_exists(_tokenId), "Ticket does not exist");
        
    //     Entrada memory attributes = _entradas[_tokenId];
    //     return(
    //         attributes.tipoEntrada,
    //         attributes.numAsiento,
    //         attributes.precio,
    //     );
    // }

}