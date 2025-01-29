import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../common/types/dto-generated/api.types.ts";
import { FC } from "react";
import { Form, Formik, useField } from "formik";
import * as yup from "yup";

const apiClient = new Api({
  baseURL: "http://localhost:4400",
});

const InputField: FC<{ name: string; label: string }> = ({ name, label }) => {
  const [{ onBlur, onChange, value }, { error, touched }] = useField(name);
  const isError = touched && !!error;

  return (
    <TextField
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      error={isError}
      label={label}
      helperText={isError ? error : ""}
    />
  );
};

export const Content = () => {
  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return apiClient.v1.getUsers().then((req) => req.data);
    },
    staleTime: 2000,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (id: string) => {
      await apiClient.v1.deleteUser(id);
      await refetch();
    },
  });

  const { mutateAsync: createUser } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (payload: { name: string; age: number }) => {
      await apiClient.v1.createUser(payload);
      await refetch();
    },
  });

  return (
    <Box>
      <Formik
        initialValues={{ name: "", age: 0 }}
        onSubmit={async (values, { resetForm }) => {
          await createUser(values);
          resetForm();
        }}
        validationSchema={yup.object({
          name: yup.string().min(4).max(20).required(),
          age: yup.number().min(1).max(120).required(),
        })}
      >
        <Form>
          <InputField name="name" label="Name" />
          <InputField name="age" label="Age" />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Form>
      </Formik>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="left">{row.age}</TableCell>
                <TableCell align="left">
                  <Button color="error" onClick={() => mutateAsync(row.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
