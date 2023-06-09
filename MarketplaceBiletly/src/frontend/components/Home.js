import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';
import Bd from '../../backend/helper/Bd.js';

const Home = ({ nft, account }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const loadMarketplaceItem = async () => {
        const ticketCount = await nft.tokenCount();
        let tickets = []
        for (let i = 1; i <= ticketCount; i++) {
            const ticket = await nft.entradas(i);                
            // if (!(await nft.ticketSold(i))) {
                const uri = await nft.tokenURI(i);
                const response = await fetch(uri);
                const metadata = await response.json()
                const ticketTotalPrice = await nft.getTotalPrice(i);
                tickets.push({
                    totalPrice : ticketTotalPrice,
                    itemId: ticket.idEntrada,
                    seller: nft.getOwner(ticket.idEntrada),
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    sold: await nft.ticketSold(ticket.idEntrada)
                });
            // }
        }
        setLoading(false);
        setItems(tickets);
    }

    const buyMarketItem = async (item) => {     
        await nft.sellTicket(item.itemId, {value: item.totalPrice }).wait();
        loadMarketplaceItem();
    }

    useEffect(() => {
        loadMarketplaceItem()
    }, [])

    if (loading) return (
        <main style={{ padding: "1rem 0" }}>
            <h2>Loading...</h2>
        </main>
    )

    return (
        <div className="flex justify-center">
            {items.length > 0 ?
                <div className="px-5 container">
                    <Row xs={1} md={2} lg={4} className="g-4 py-5">
                        {items.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image} style={{objectFit: 'cover'}}/>
                                    <Card.Body color="secondary">
                                        <Card.Title>{item.name}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className="d-grid">
                                            {item.sold === false ?
                                                <Button onClick={() => buyMarketItem(item)} variant="outline-dark" size="lg">
                                                Buy by {ethers.utils.formatEther(item.totalPrice)} ETH
                                                </Button>
                                            : (
                                                <h5>Ticket sold</h5>
                                            )} 
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
                : (
                    <main style={{ padding: "1rem 0" }}>
                        <h2>No assets</h2>
                    </main>
                )}

            <Bd/>
        </div>
    );
}

export default Home