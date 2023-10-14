import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import SearchBar from '../components/SearchBar';
import PsychiatristList from '../components/psychiatrists/PsychiatristList';
import json_results from '../temp_data/psychs.json';
import { IPsychiatrist } from '@/schema';
import colors from "@/colors";

const psychiatrists: IPsychiatrist[] = Object.values(json_results)

console.log(psychiatrists);

// options for fuzzy search. currently only searches by name and title
const fuseOptions = {
  keys: ['first_name', 'last_name', 'title'],
  threshold: 0.5,
  findAllMatches: true,
  distance: 5,
  ignoreLocation: true,
  useExtendedSearch: true,
};

const DiscoverPage: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState([]);
  const [submittedFilters, setSubmittedFilters] = useState({});
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [allDays, setAllDays] = useState(false);
  const [english, setEnglish] = useState(false);
  const [ga, setGa] = useState(false);
  const [twi, setTwi] = useState(false);
  const [hausa, setHausa] = useState(false);
  const [allLanguages, setAllLanguages] = useState(false);
  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);
  const [bothGenders, setBothGenders] = useState(false);

  const fuse = useMemo(() => new Fuse(psychiatrists, fuseOptions), []);

  // Stores newSearchTerm in searchTerm
  const handleSearch = (newSearchTerm: string) => {
    console.log(newSearchTerm);
    setSearchTerm(newSearchTerm);
    console.log(filters)
  };

  // Checks if arr1 contains every element in arr2
  function containsAll(arr1: string[], arr2: string[]): boolean {

    console.log(arr1)
    console.log(arr2)

    if (arr1 && arr2) {
      console.log(arr2.every(item => arr1.includes(item)))
      return arr2.every(item => arr1.includes(item))
    }
    else if (!arr2) { return true }
    else {
      return false
    }
  }

  // Checks if arr1 contains at least one element in arr2
  function containsOneOf(arr1: string[], arr2: string[]): boolean {

    console.log(arr1)
    console.log(arr2)

    if (arr1 && arr2) {
      if (arr2.length === 0) { return true }
      console.log(arr2.some(item => arr1.includes(item)))
      return arr2.some(item => arr1.includes(item))
    }
    else if (!arr2) { return true }
    else {
      return false
    }
  }

  function containsGender(gender: number, genderArray: number[]): boolean {
    if (genderArray) {
      if (genderArray.includes(gender) || genderArray.length === 0)
        return true
      else
        return false
    }
    return true
  }

  // Filters psychiatrists by search and/or selected filters
  const processSearchFilter = () => {

    const terms = searchTerm.trim().split(/\s+/);
    let results = psychiatrists;

    console.log("HI IM FILTERINGGGGGGGGGGGGGGGG")

    // Updates result by search term (first names, last names, and/or titles)
    // Handles searches with three terms
    if (terms.length === 3) {
      const [firstTerm, secondTerm, thirdTerm] = terms;
      results = psychiatrists.filter((psychiatrist) =>
      ((psychiatrist.first_name.toLowerCase().includes(firstTerm.toLowerCase()) ||
        psychiatrist.last_name.toLowerCase().includes(firstTerm.toLowerCase()) ||
        psychiatrist.title.toLowerCase().includes(firstTerm.toLowerCase())) &&
        (psychiatrist.first_name.toLowerCase().includes(secondTerm.toLowerCase()) ||
          psychiatrist.last_name.toLowerCase().includes(secondTerm.toLowerCase()) ||
          psychiatrist.title.toLowerCase().includes(secondTerm.toLowerCase())) &&
        (psychiatrist.first_name.toLowerCase().includes(thirdTerm.toLowerCase()) ||
          psychiatrist.last_name.toLowerCase().includes(thirdTerm.toLowerCase()) ||
          psychiatrist.title.toLowerCase().includes(thirdTerm.toLowerCase()))));
    }
    // Handles searches with two terms
    if (terms.length === 2) {
      const [firstTerm, secondTerm] = terms;
      results = psychiatrists.filter((psychiatrist) =>
      ((psychiatrist.first_name.toLowerCase().includes(firstTerm.toLowerCase()) ||
        psychiatrist.last_name.toLowerCase().includes(firstTerm.toLowerCase()) ||
        psychiatrist.title.toLowerCase().includes(firstTerm.toLowerCase())) &&
        (psychiatrist.first_name.toLowerCase().includes(secondTerm.toLowerCase()) ||
          psychiatrist.last_name.toLowerCase().includes(secondTerm.toLowerCase()) ||
          psychiatrist.title.toLowerCase().includes(secondTerm.toLowerCase())))
      );
    }
    // Handles searches with one term
    else if (terms.length === 1) {
      const term = terms[0];
      results = psychiatrists.filter((psychiatrist) =>
        psychiatrist.first_name.toLowerCase().includes(term.toLowerCase()) ||
        psychiatrist.last_name.toLowerCase().includes(term.toLowerCase()) ||
        psychiatrist.title.toLowerCase().includes(term.toLowerCase()));
    }

    // Updates results by the selected filters
    const filterResults = results.filter((psychiatrist) => {
      console.log(psychiatrist.gender)
      console.log(typeof (psychiatrist.gender))
      console.log(submittedFilters['genders'])
      console.log(containsGender(psychiatrist.gender, submittedFilters['genders']))
      return containsOneOf(psychiatrist.availability, submittedFilters['days']) &&
        containsOneOf(psychiatrist.language, submittedFilters['languages']) &&
        containsGender(psychiatrist.gender, submittedFilters['genders'])
    });

    return filterResults;
  };

  // If there is a search term or there are filters selected, process the search/filter
  // Else, return all psychiatrists
  const searchFilterResults = searchTerm || submittedFilters ? processSearchFilter() : psychiatrists;


  return (
    <div className={'px-24 pt-9 pb-14'}>
      <div className='pb-8'>
        <SearchBar onSearch={handleSearch}
          filters={filters} setFilters={setFilters}
          monday={monday} setMonday={setMonday}
          tuesday={tuesday} setTuesday={setTuesday}
          wednesday={wednesday} setWednesday={setWednesday}
          thursday={thursday} setThursday={setThursday}
          friday={friday} setFriday={setFriday}
          saturday={saturday} setSaturday={setSaturday}
          sunday={sunday} setSunday={setSunday}
          allDays={allDays} setAllDays={setAllDays}
          english={english} setEnglish={setEnglish}
          ga={ga} setGa={setGa}
          twi={twi} setTwi={setTwi}
          hausa={hausa} setHausa={setHausa}
          allLanguages={allLanguages} setAllLanguages={setAllLanguages}
          male={male} setMale={setMale}
          female={female} setFemale={setFemale}
          bothGenders={bothGenders} setBothGenders={setBothGenders}
          submittedFilters={submittedFilters} setSubmittedFilters={setSubmittedFilters} />
      </div>
      {searchFilterResults.length > 0 ? (
        <PsychiatristList results={searchFilterResults} />
      ) : (
        <div className="text-center my-10">
          <p className="mb-4">No Psychiatrists found based on your filters.</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setSearchTerm("")}
          >
            See all psychiatrists
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;