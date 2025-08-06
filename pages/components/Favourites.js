import { favouritesAtom } from "@/store";
import { Card, Col, Row } from "react-bootstrap";
import ArtworkCard from "./ArtworkCard";
import { useAtom } from "jotai";

export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom);
  if (!favouritesList) return null;

  if (favouritesList) {
    return (
      <>
        <Row className="gy-4">
          {favouritesList.length ? (
            favouritesList.map((art) => {
              return (
                <Col lg={3} key={art}>
                  <ArtworkCard objectId={art} />
                </Col>
              );
            })
          ) : (
            <Card>
              <h4>Nothing Here</h4>
              <p>Try Adding something to favourites...</p>
            </Card>
          )}
        </Row>
      </>
    );
  } else {
    <p>Loading</p>;
  }
}
