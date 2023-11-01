import { createAppointment, fetchAppointment, updateAppointment, deleteAppointment } from "./IAppointment";
import { createAvailability, fetchAvailability, updateAvailability, deleteAvailability } from "./IAvailability";
import { createPatient, fetchPatient, updatePatient, deletePatient } from "./IPatient";
import { createPsychiatrist, fetchPsychiatrist, fetchAllPsychiatrist, updatePsychiatrist, deletePsychiatrist } from "./IPsychiatrist";
import { IAppointment, IAvailability, IPsychiatrist, IPatient } from "@/schema";
import { CollectionReference, DocumentData, Timestamp, where } from "firebase/firestore";
import { fetchDocumentId } from "./fetchData";

const PYSCH = "psychiatrists"
const PATIENT = "patients"

export const createTest = async () => {
    const newAvailability: IAvailability = {
        profId: "1",
        startTime: Timestamp.now(),
        endTime: Timestamp.now()
    }

    const newAppointment: IAppointment = {
        profId: "1",
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        clientId: "2"
    }

    const newPsych: IPsychiatrist = {
        uid: "1",
        firstName: "John",
        lastName: "Paul",
        position: "idk",
        profile_pic: null,
        availability: ["newAvailability"],
        gender: 0,
        location: "chicago",
        language: ["english"],
        specialty: [],
        description: "fake psych",
        website: "nonexistent"
    }

    const newPsych2: IPsychiatrist = {
        uid: "2",
        firstName: "El",
        lastName: "Noel",
        position: "idk",
        profile_pic: null,
        availability: ["newAvailability"],
        gender: 1,
        location: "Jersey",
        language: ["english"],
        specialty: [],
        description: "fake psych",
        website: "nonexistent"
    }

    const newPatient: IPatient = {
        uid: "1",
        firstName: "David",
        lastName: "Rodriguez",
        email: "fakeemail@.com",
        concerns: "everything",
        previousTherapyExperience: "None",
        lastTherapyTimeframe: "Months",
        ageRange: "18-22", //go on the figma and in the login profile it shows ranges not age
        prefLanguages: ["english"],
        genderPref: 0,
        savedPsychiatrists: ["John Paul"] //this should not be a string list...
    }

    // await createAvailability(newAvailability)
    // console.log("New availability made")
    // await createAppointment(newAppointment)
    // console.log("New appointment made")

    // await createPsychiatrist(newPsych)
    // console.log("New psychiatrist made")
    // await createPsychiatrist(newPsych2)
    // console.log("New psychiatrist2 made")
    // await createPatient(newPatient)
    // console.log("New user made")

    const retrievedAvailabilities = await fetchAvailability([where("profId", "==", "1")]);
    const retrievedAppointments = await fetchAppointment([where("profId", "==", "1")]);

    // const retrievedPsych = await fetchPsychiatrist("John", "Paul");
    const retrievedPsych = await fetchAllPsychiatrist([where("firstName", "==", "John")]);
    const retrievedAllPsych = await fetchAllPsychiatrist([]);
    const retrievedPatient = await fetchPatient([where("uid", "==", "1")])

    console.log("Retrieved availabilities")
    console.log(retrievedAvailabilities)
    console.log("Retrived appointments")
    console.log(retrievedAppointments)

    console.log("Retrieved psych")
    console.log(retrievedPsych)
    console.log("Retrieved all psychs")
    console.log(retrievedAllPsych)
    console.log("Retrived user")
    console.log(retrievedPatient)

    const updateAvailability1: IAvailability = {
        profId: "1",
        startTime: Timestamp.now(),
        endTime: Timestamp.now()
    }

    const updateAppointment1: IAppointment = {
        profId: "1",
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        clientId: "2"
    }

    const updatedPsych: IPsychiatrist = {
        uid: "1",
        firstName: "John",
        lastName: "Paul",
        position: "idk",
        profile_pic: null,
        availability: ["docref"],
        gender: 0,
        location: "Paris",
        language: ["english"],
        specialty: [],
        description: "fake psych",
        website: "nonexistent"
    }

    const updatedPatient: IPatient = {
        uid: "1",
        firstName: "David",
        lastName: "Rodriguez",
        email: "fakeemail@.com",
        concerns: "everything",
        previousTherapyExperience: "None",
        lastTherapyTimeframe: "Months",
        ageRange: "18-22",
        prefLanguages: ["english", "spanish"],
        genderPref: 0,
        savedPsychiatrists: ["John Paul"]
    }

    await updateAvailability("IMnyeGm61VxgsDAJt6GH", updateAvailability1)
    console.log("Updated availability")
    await updateAppointment("LSXu8dGfu4v3qKDao8En", updateAppointment1)
    console.log("Updated appointment")

    const psychDocID = await fetchDocumentId(PYSCH, updatedPsych.uid)
    const psych2DocID = await fetchDocumentId(PYSCH, newPsych2.uid)
    const patientDocID = await fetchDocumentId(PATIENT, updatedPatient.uid)

    console.log(psychDocID)
    await updatePsychiatrist(psychDocID, updatedPsych)

    console.log("Updated Psych 1")
    await updatePatient(patientDocID, updatedPatient)
    console.log("Updated Patient")

    await deleteAvailability("IMnyeGm61VxgsDAJt6GH")
    console.log("Deleted availability")
    await deleteAppointment("LSXu8dGfu4v3qKDao8En")
    console.log("Deleted appointment")

    await deletePsychiatrist(psychDocID)
    console.log("Deleted psychiatrist John Paul")
    await deletePsychiatrist(psych2DocID)
    console.log("Deleted psychiatrist El Noel")
    await deletePatient(patientDocID)
    console.log("Deleted patient David Rodriguez")


}