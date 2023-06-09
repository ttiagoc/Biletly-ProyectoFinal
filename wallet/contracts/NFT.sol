// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "./@rarible/royalties/contracts/impl/RoyaltiesV2Impl.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./@rarible/royalties/contracts/LibRoyaltiesV2.sol";

contract NFT is ERC721URIStorage, Ownable, ReentrancyGuard, RoyaltiesV2Impl{

    uint public tokenCount = 0;
    uint96 public porcentajeReventa;
    address payable public cuentaMaestra;

    struct Entrada {
        uint idEntrada;
        string descripcion;     
    }

    struct Evento{
        uint idEvento;
        string fecha;
        string nombre;
        string descripcion;
    }

    mapping(uint => Entrada) public entradas;  
    mapping(uint => Evento) public entradasEventos;  
    mapping(uint => bool) private _entradaVendida;
    mapping(uint => address) private _propietarioEntrada;
    mapping(uint => bool) private _entradaUtilizada;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor(uint96 _porcentajeReventa) ERC721("NFTicket", "TICKET"){
        porcentajeReventa = _porcentajeReventa;
        cuentaMaestra = payable(msg.sender);
    }    

    /*function mint(string memory _tokenURI, string memory _descripcion, uint _precio, Evento memory _evento) external nonReentrant onlyOwner() returns (uint){ // NO SE SI PONERLE ONLYOWNER

        tokenCount++;
        // require(_precio > 0, "ERC721: Price must be greater than zero");
        require(!_exists(tokenCount), "ERC721: Ticket already exists");
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        
        Entrada memory attributes;
        attributes.idEntrada = tokenCount;
        attributes.descripcion = _descripcion;
        attributes.precio = _precio;        
        entradas[tokenCount] = attributes;        

        Evento memory evento;
        evento.idEvento = _evento.idEvento;
        evento.fecha = _evento.fecha;
        evento.nombre = _evento.nombre;
        evento.descripcion = _evento.descripcion;
        entradasEventos[tokenCount] = evento;

        _entradaVendida[tokenCount] = false;
        _entradaUtilizada[tokenCount] = false;
        _propietarioEntrada[tokenCount] = msg.sender;

        emit Offered(
            tokenCount,
            _precio,
            payable(msg.sender)
        );

        return tokenCount;
    } */

    //Manda address por param, no manda precio
    function mint(address _address, string memory _tokenURI, string memory _descripcion, Evento memory _evento) external nonReentrant onlyOwner() returns (uint){ // NO SE SI PONERLE ONLYOWNER

        tokenCount++;
        // require(_precio > 0, "ERC721: Price must be greater than zero");
        require(!_exists(tokenCount), "ERC721: Ticket already exists");
        _safeMint(_address, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        
        Entrada memory attributes;
        attributes.idEntrada = tokenCount;
        attributes.descripcion = _descripcion;      
        entradas[tokenCount] = attributes;        

        Evento memory evento;
        evento.idEvento = _evento.idEvento;
        evento.fecha = _evento.fecha;
        evento.nombre = _evento.nombre;
        evento.descripcion = _evento.descripcion;
        entradasEventos[tokenCount] = evento;

        _entradaVendida[tokenCount] = false;
        _entradaUtilizada[tokenCount] = false;
        _propietarioEntrada[tokenCount] = _address;

        _setRoyalties(tokenCount, cuentaMaestra, porcentajeReventa);
        return tokenCount;
    }

    function _setRoyalties(uint _tokenId, address payable _royaltiesReceipientAddress, uint96 _percentageBasisPoints) internal onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = _percentageBasisPoints;
        _royalties[0].account = _royaltiesReceipientAddress;
        _saveRoyalties(_tokenId, _royalties);
    }

    // royaltyInfo function should return the address to which the funds must be sent and the amount (the 10% of the value of the token transfered).
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address receiver, uint256 royaltyAmount) {
        LibPart.Part[] memory _royalties = royalties[_tokenId];
        if(_royalties.length > 0) {
            return (_royalties[0].account, (_salePrice * _royalties[0].value)/10000);
        }
        return (address(0), 0);

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        if(interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
            return true;
        }
        if(interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }
        return super.supportsInterface(interfaceId);        
    }
    
    function transferFrom(
        address _from,
        address _to,
        uint _tokenId
    ) public virtual override{
        
        require(_exists(_tokenId), "ERC721: Ticket does not exist");
        require(getOwner(_tokenId) != _to, "ERC721: To address is already the owner of the ticket");
        require(getOwner(_tokenId) == _from, "ERC721: From address is not the owner of the ticket");
        require(_from != address(0x0), 'ERC721: Invalid from address');
        require(_to != address(0x0), 'ERC721: Invalid to address');
        //require(_isApprovedOrOwner(_msgSender(), _tokenId), 'ERC721: MsgSender is not the owner of the token');

        _transfer(_from, _to, _tokenId);
        _entradaVendida[_tokenId] = true;
        _propietarioEntrada[_tokenId] = _to;

    }

    function useTicket(uint _tokenId, uint _idEvento) external returns (bool) {
        require(_exists(_tokenId), "ERC721: Ticket does not exist");
        require(!ticketUsed(_tokenId), "ERC721: Ticket has already been used");   
        require(getEvent(_tokenId).idEvento == _idEvento, "ERC721: Not a ticket from the event"); 
        require(getOwner(_tokenId) == msg.sender, "ERC721: Not the ticket owner"); // NO SE BIEN 

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

    function getEvent(uint _tokenId) public view returns (Evento memory){
        return entradasEventos[_tokenId];       
    }

}