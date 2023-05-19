import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import client , {subdomain} from '../../backend/config/Infura';
// import 'dotenv/config'
// import * as fs from 'fs-extra';

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Create = ({ nft, account }) => {

    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState(null);
    const [price, setPrice] = useState(null);
    const [description, setDescription] = useState(null);
    
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file);
                // console.log(result);
                setImage(`${subdomain}/ipfs/${result.path}`);
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    }

    const createNFT = async () => {        
             
        if (!image || !price || !name || !number) return
        try {     
            setDescription('TICKET NAME: ' +  name + ' - NUMBER: ' + number + ' - PRICE: ' + price + 'ETH');     
            if(description != null){
                console.log()
                const result = await client.add(JSON.stringify({ image, price, name, description }));
                console.log(result);
                mintThenList(result);
            }else{
                setDescription('TICKET NAME: ' +  name + ' - NUMBER: ' + number + ' - PRICE: ' + price + 'ETH'); 
                
            }
        } catch (error) {
            console.log("ipfs uri uload error: ", error);
        }

    }

    const mintThenList = async (result) => {
        const uri = `${subdomain}/ipfs/${result.path}`;
        const listingPrice = ethers.utils.parseEther(price.toString());
        await (await nft.mint(uri, description, listingPrice, 1)).wait();

        // const id = await nft.tokenCount();
        // setId(await nft.tokenCount());
        // await (await nft.setApprovalForAll(marketplace.address, true));
        // await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    }
    
    return (
        <div className="container-fluid mt-5">
            <div className='row'>
                <main role="main" className='col-lg-12 mx-auto' style={{ maxWidth: '1000px' }}>
                    <div className='content mx-auto'>
                        <Row className='g-4'>
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS} />                            
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setNumber(e.target.value)} size="lg" required type="number" placeholder="Place/Number of ticket" />
                            {/* <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description"/> */}
                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder='Price (ETH)' />
                            <div className='g-grid px-0'>
                                <Button onClick={createNFT} variant="dark" size="lg">
                                    Create and list NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
   
}

export default Create;