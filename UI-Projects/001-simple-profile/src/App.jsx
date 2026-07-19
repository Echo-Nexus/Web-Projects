import "./App.css";
import Card from "./components/Card";
const App = () => {
  const datas = [
    {
      name: "Arix Ratgaiya",
      image:
        "https://plus.unsplash.com/premium_photo-1779748921527-5aeea34b3aad?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Full Stack Developer passionate about web technologies and problem solving.",
    },
    {
      name: "Emma Wilson",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      description:
        "UI/UX Designer who loves creating beautiful and user-friendly interfaces.",
    },
    {
      name: "John Carter",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      description:
        "Backend Engineer specializing in Node.js, APIs, and cloud services.",
    },
    {
      name: "Sophia Brown",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      description:
        "Digital Marketing Expert with experience in SEO and social media growth.",
    },
    {
      name: "Michael Lee",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      description:
        "Data Analyst skilled in Python, SQL, and business intelligence tools.",
    },
  ];

  return (
    <div className="parent">
      {datas.map((data) => (
        <Card
          key={data.name}
          name={data.name}
          image={data.image}
          description={data.description}
        />
      ))}
    </div>
  );
};

export default App;
