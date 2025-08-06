import { Col, Row } from "react-bootstrap";
import ArtworkCardDetail from "../components/ArtworkCardDetail";
import { useRouter } from "next/router";

export default function ArtworkById() {
  const router = useRouter();

  if (!router.isReady) {
    return <p>Loading...</p>;
  }

  const { objectID } = router.query;

  if (objectID) {
    return (
      <>
        <Row>
          <Col>
            <ArtworkCardDetail objectID={objectID} />
          </Col>
        </Row>
      </>
    );
  }else{
    return<p>Loading...</p>
  }
}
