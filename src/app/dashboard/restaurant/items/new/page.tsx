import { Section } from "@/components/Section";
import AddItemForm from "./AddItemForm";

export const metadata = {
  title: "Add New Item - Restaurant Dashboard - Wroom",
  description: "Create and add a new item to your restaurant's menu."
};

const AddItemPage = () => {
  return (
    <Section>
      <header>
        <h1>Add new item</h1>
      </header>
      <AddItemForm />
    </Section>
  );
};

export default AddItemPage;
