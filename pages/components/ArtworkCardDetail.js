import useSWR from "swr";
import { useEffect, useState } from "react";
import Error from "next/error";
import { Button, Card } from "react-bootstrap";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";



const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail({ objectID }) {
  
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(()=>{
    setShowAdded(favouritesList?.includes(objectID))
}, [favouritesList,objectID])


  async function favouritesClicked() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID)) 
      //console.log(favouritesList)
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(objectID))
      setShowAdded(true);
      //console.log(favouritesList)
    }
  }


  const [cardData, setCardData] = useState(null);

  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setCardData(data);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;

  if (!cardData) return <p>loading...</p>;

  const source =
    cardData.primaryImage || `https://placehold.co/375x375?text=Not+Available`;

  const ref = `/artwork/${cardData.objectID}`;

  return (
    <>
      <Card>
        <Button
          variant={showAdded ? "primary" : "outline-primary"}
          onClick={favouritesClicked}
        >
          {showAdded ? "+ favourite(Added)" : "+ favourite"}
        </Button>
        <Card.Img variant="top" src={source} alt="image" />
        <Card.Body>
          <Card.Title>{cardData.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>
            {cardData.objectDate || "N/A"}
            <br />
            <strong>Classification: </strong>
            {cardData.classification || "N/A"}
            <br />
            <strong>Medium: </strong>
            {cardData.medium || "N/A"} <br />
            <br />
            <strong>Artist: </strong>
            {cardData.artistDisplayName ? (
              <>
                <span>{cardData.artistDisplayName}</span> (
                <a
                  href={cardData.artistWikidata_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  wiki
                </a>
                )
              </>
            ) : (
              "N/A"
            )}
            <br />
            <strong>Credit Line: </strong>
            {cardData.creditLine || "N/A"} <br />
            <strong>Dimensions: </strong>
            {cardData.dimensions || "N/A"} <br />
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}


