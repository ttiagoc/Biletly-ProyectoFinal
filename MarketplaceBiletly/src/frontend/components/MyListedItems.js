import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card } from 'react-bootstrap';

// function renderSoldItems(items) {
//     return (
//         <>
//             <h2>Sold</h2>
//             <Row xs={1} md={2} lg={4} className="g-4 py-3">
//                 {items.map((item, idx) => (
//                     <Col key={idx} className="overflow-hidden">
//                         <Card>
//                             <Card.Img variant="top" src={item.image} />
//                             <Card.Footer>
//                                 For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
//                             </Card.Footer>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         </>
//     )
// }

export default function MyListedItems({ nft, account }) {
    const [loading, setLoading] = useState(true);
    const [listedItems, setListedItems] = useState([]);
    // const [soldItems, setSoldItems] = useState([]);

    const loadListedItems = async () => {
        const itemCount = await nft.tokenCount();
        let listedItems = [];
        let soldItems = [];
        for (let indx = 1; indx <= itemCount; indx++) {
            const i = await nft.entradas(indx);
            // console.log(String(await nft.getOwner(i.idEntrada)).toUpperCase())
            // console.log(account.toString().toUpperCase())            
            if (String(await nft.getOwner(i.idEntrada)).toUpperCase() === account.toString().toUpperCase() && !(await nft.ticketSold(i.idEntrada))) {
                const uri = await nft.tokenURI(i.idEntrada);
                const response = await fetch(uri);
                const metadata = await response.json();
                const totalPrice = await nft.getTotalPrice(i.idEntrada);
                let item = {
                    totalPrice,
                    price: i.precio,
                    itemId: i.idEntrada,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                };
                listedItems.push(item);                
                // if (await nft.ticketSold(item.itemId)){
                //     soldItems.push(item);
                // }
            }
        }
        setLoading(false);
        setListedItems(listedItems);
        // setSoldItems(soldItems);
    }
    useEffect(() => {
        loadListedItems()
    }, [])
    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    );
    return (
        <div className='flex justify-center'>
            {listedItems.length > 0 ?
                <div className='px-5 py-3 container'>
                    <Row xs={1} md={2} lg={4} className="g-4 py-3">
                        {listedItems.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image} />
                                    <Card.Footer>
                                        {ethers.utils.formatEther(item.totalPrice)} ETH
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
                </div>
                : (
                    <main style={{ padding: "1rem 0" }}>
                        <h2> No assets </h2>
                    </main>
                )}
        </div>
    );
}