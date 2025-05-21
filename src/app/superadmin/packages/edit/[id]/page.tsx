'use client';
import { useParams } from "next/navigation";
import Package from "../../components/Package";

const EditPackage = () => {
    const { id } = useParams();
    return <Package mode="edit" packageId={Number(id)} />;
};

export default EditPackage;