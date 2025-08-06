import { searchHistoryAtom } from "@/store";
import { Button, Card, ListGroup, Row } from "react-bootstrap";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const router = useRouter();

  if (!searchHistory) return null;

  let parsedHistory = [];

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    e.preventDefault();
    //console.log(searchHistory[index]);
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation(); // stop the event from trigging other events
    setSearchHistory(await removeFromHistory(searchHistory[index])) 
  }

  if (parsedHistory) {
    return (
      <>
        <h1 align="center">History</h1>
        <Row className="gy-4">
          {parsedHistory.length ? (
            parsedHistory.map((historyItem, index) => {
              return (
                <ListGroup key={index}>
                  <ListGroup.Item
                    onClick={(e) => historyClicked(e, index)}
                    className={styles.historyListItem}
                  >
                    {Object.keys(historyItem).map((key) => (
                      <>
                        {key}: <strong>{historyItem[key]}</strong>&nbsp;
                      </>
                    ))}
                    <Button
                      className="float-end"
                      variant="danger"
                      size="sm"
                      onClick={(e) => removeHistoryClicked(e, index)}
                    >
                      &times;
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              );
            })
          ) : (
            <Card>
              <h4>Nothing Here</h4>
              <p>Try searching for some artwork...</p>
            </Card>
          )}
        </Row>
      </>
    );
  } else {
    <p>Loading</p>;
  }
}
