'use client';
import { useParams } from "next/navigation";
import EmployeeForm from "../../../components/EmployeeForm";


const EditEmployeePage = () => {
  const { id } = useParams();
  return <EmployeeForm mode="edit" employeeId={Number(id)} />;
};

export default EditEmployeePage;