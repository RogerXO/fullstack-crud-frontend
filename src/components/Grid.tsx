import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { User } from "../models/models";

interface GridProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setOnEdit: React.Dispatch<React.SetStateAction<User | null>>;
}

interface ThProps {
  onlyweb?: boolean;
}

interface TdProps {
  onlyweb?: boolean;
  aligncenter?: boolean;
  width?: string;
  icon?: boolean;
}

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 800px;
  margin: 20px auto;
  word-break: break-all;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th<ThProps>`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;

  @media (max-width: 500px) {
    ${(props) => props.onlyweb && "display: none"}
  }
`;

export const Td = styled.td<TdProps>`
  padding-top: 15px;
  text-align: ${(props) => (props.aligncenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};
  ${(props) => props.icon && "cursor: pointer"};

  @media (max-width: 500px) {
    ${(props) => props.onlyweb && "display:none"}
  }
`;

function Grid({ users, setUsers, setOnEdit }: GridProps) {
  function handleEdit(item: User) {
    setOnEdit(item);
  }

  async function handleDelete(id: number) {
    await axios
      .delete("http://localhost:8800/" + id)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.id !== id);

        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Nome</Th>
          <Th>Email</Th>
          <Th onlyweb>Fone</Th>
          <Th></Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((item, i) => (
          <Tr key={i}>
            <Td width="30%">{item.name}</Td>
            <Td width="30%">{item.email}</Td>
            <Td width="20%" onlyweb>
              {item.phone}
            </Td>
            <Td width="5%" aligncenter icon>
              <FaEdit onClick={() => handleEdit(item)} />
            </Td>
            <Td width="5%" aligncenter icon>
              <FaTrash onClick={() => handleDelete(item.id)} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default Grid;
