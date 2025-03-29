import { useEffect, useRef } from "react";
import styled from "styled-components";
import { User } from "../models/models";
import axios from "axios";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

interface FormProps {
  onEdit: User | null;
  setOnEdit: React.Dispatch<React.SetStateAction<User | null>>;
  getUsers(): void;
}

function Form({ onEdit, setOnEdit, getUsers }: FormProps) {
  const ref = useRef<HTMLFormElement>(null);

  let nameInput: HTMLInputElement | null = null;
  let emailInput: HTMLInputElement | null = null;
  let phoneInput: HTMLInputElement | null = null;
  let birthInput: HTMLInputElement | null = null;

  useEffect(() => {
    if (onEdit && ref.current !== null) {
      setFormValue();

      if (nameInput) nameInput.value = onEdit.name;
      if (emailInput) emailInput.value = onEdit.email;
      if (phoneInput) phoneInput.value = onEdit.phone;
      if (birthInput) birthInput.value = onEdit.birth;
    }
  }, [onEdit]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormValue();

    if (
      !nameInput?.value ||
      !emailInput?.value ||
      !phoneInput?.value ||
      !birthInput?.value
    ) {
      return toast.warn("Fill all the fields!");
    }

    if (onEdit) {
      await axios
        .put("http://localhost:8800/" + onEdit.id, {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          birth: birthInput.value.toString(),
        })
        .then(({ data }) => {
          toast.success(data);
          afterSuccessRequest();
        })
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:8800", {
          name: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          birth: birthInput.value.toString(),
        })
        .then(({ data }) => {
          toast.success(data);
          afterSuccessRequest();
        })
        .catch(({ data }) => toast.error(data));
    }
  }

  function afterSuccessRequest() {
    resetInputsValue();
    setOnEdit(null);
    getUsers();
  }

  function resetInputsValue() {
    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (birthInput) birthInput.value = "";
  }

  function setFormValue() {
    if (ref.current !== null) {
      const form = ref.current;

      nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
      emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
      phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
      birthInput = form.querySelector<HTMLInputElement>('input[name="birth"]');
    }
  }

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="name" />
      </InputArea>

      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>

      <InputArea>
        <Label>Phone</Label>
        <Input name="phone" />
      </InputArea>

      <InputArea>
        <Label>Birth Date</Label>
        <Input name="birth" type="date" />
      </InputArea>

      <Button type="submit">SAVE</Button>
    </FormContainer>
  );
}

export default Form;
