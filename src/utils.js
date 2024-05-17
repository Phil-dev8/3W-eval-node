const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data", "students.json");

const readStudents = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier:", error);
    throw error;
  }
};

const writeStudents = (students) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(students));
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier:", error);
    throw error;
  }
};

const addStudent = (name, birth) => {
  try {
    const students = readStudents();
    students.push({ name, birth });
    writeStudents(students);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un tudiant:", error);
    throw error;
  }
};

const deleteStudent = (name) => {
  try {
    let students = readStudents();
    students = students.filter((student) => student.name !== name);
    writeStudents(students);
  } catch (error) {
    console.error("Erreur lors de la suppression d'un étudiant:", error);
    throw error;
  }
};

module.exports = {
  readStudents,
  addStudent,
  deleteStudent,
};
