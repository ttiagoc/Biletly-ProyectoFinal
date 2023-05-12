import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';

const Home = ({ nft }) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const loadMarketplaceItem = async () => {
        const ticketCount = await nft.tokenCount();
        let tickets = []
        for (let i = 1; i <= ticketCount; i++) {
            const ticket = await nft.entradas(i);                
            if (!(await nft.ticketSold(i))) {
                const uri = await nft.tokenURI(i);
                const response = await fetch(uri);
                const metadata = await response.json()
                const totalPrice = await nft.getTotalPrice(i);
                tickets.push({
                    totalPrice,
                    itemId: ticket.idEntrada,
                    seller: nft.getOwner(ticket.idEntrada),
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                });
            }
        }
        setLoading(false);
        setItems(tickets);
    }

    const buyMarketItem = async (item) => {
        console.log(ethers.utils.formatEther(item.totalPrice))
        (await nft.sellTicket(item.idEntrada, {value: item.totalPrice})).wait();
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
                                        <Card.Text>{item.description}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className="d-grid">
                                            <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                                                Buy by {ethers.utils.formatEther(item.totalPrice)} ETH
                                            </Button>
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
        </div>
    );
}

export default Home