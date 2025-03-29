import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Form.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Grid from "./components/Grid.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "./models/models.ts";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [onEdit, setOnEdit] = useState<User | null>(null);

  async function getUsers() {
    try {
      const res = await axios.get<User[]>("http://localhost:8800");
      setUsers(res.data.sort((a, b) => (a.name > b.name ? 1 : -1)));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, [setUsers]);

  return (
    <>
      <Container>
        <Title>USERS</Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
        <Grid users={users} setUsers={setUsers} setOnEdit={setOnEdit} />
      </Container>
      <ToastContainer autoClose={1500} position="top-right" />
      <GlobalStyle />
    </>
  );
}

export default App;
