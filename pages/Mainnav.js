import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NavDropdown } from "react-bootstrap";
import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function Mainnav() {
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState("");

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    setToken(readToken());
  }, []);

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  async function submitForm(e) {
    e.preventDefault(); // prevent the browser from automatically submitting the form
    setSearchHistory(await addToHistory(`title=true&q=${search}`));
    setIsExpanded(false);
    router.push(`/artwork?title=true&q=${search}`);
  }

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary fixed-top"
        expanded={isExpanded}
      >
        <Container fluid>
          <Navbar.Brand href="#">Manraj Singh</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarScroll"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} href="/" active={router.pathname === "/"}>
                Home
              </Nav.Link>
              {token && (
                <Nav.Link
                  as={Link}
                  href="/search"
                  active={router.pathname === "/search"}
                >
                  Advanced Search
                </Nav.Link>
              )}
            </Nav>
            {token && (
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" variant="outline-success">
                  Search
                </Button>
              </Form>
            )}

            {token && (
              <Nav className="ms-3">
                <NavDropdown
                  title={token?.userName}
                  id="navbarScrollingDropdown"
                >
                  <Link href="/favourites" passHref legacyBehavior as={Link}>
                    <NavDropdown.Item
                      isExpanded="False"
                      active={router.pathname === "/favourites"}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior as={Link}>
                    <NavDropdown.Item
                      isExpanded="False"
                      active={router.pathname === "/history"}
                    >
                      History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item
                    onClick={() => {
                      logout(); // remove token
                      router.push("/login"); // redirect to login or homepage
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}

            {!token && (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link>Register</Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link>Login</Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
