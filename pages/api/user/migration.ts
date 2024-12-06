import { getNonExistingEmails, getCityIdByDescription, getCountryIdByCode } from "backend/controller/user.controller"
const fs = require("fs");
const path = require("path");

// grab all emails from tasos book
// cross them with the database. Filter out those missing
// add them manually
const extractEmails = (jsonArray) => {
    const emails = [];
  
    jsonArray.forEach(item => emails.push(item['Email']))
  
    return emails.filter(item => item !== '');
  };

function parseJsonFile(filePath) {
    try {
      // Read the JSON file synchronously
      const jsonData = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
  
      // Parse the JSON data into an object
      const parsedData = JSON.parse(jsonData);
  
      
      return parsedData;
    } catch (error) {
      console.error(`Error parsing JSON file: ${error}`);
      return null;
    }
  }

  const extractUserInfo = async (jsonArray, emails) => {
    const users = [];

  for (const item of jsonArray) {
      if (emails.includes(item['Email'])) {
          const playdeckId = item["Playdek ID"]
          const federation = item['Federation']
          const fullName = item["NAME"]
          const fullNameSplitted = fullName.split(" ")
          const fedCode = federation.split('(')[0]
          const cityDescription = item["Normalized City"]
          const phone = item["Phone Number"] 

          const cityId = await getCityIdByDescription(cityDescription)
          const countryId = await getCountryIdByCode(fedCode)
          console.log("cityId", cityId, cityDescription, item['Email'])
          users.push({
              name: playdeckId,
              first_name: fullNameSplitted[0],
              last_name: fullNameSplitted[1],
              email: item['Email'],
              country_id: Number(countryId?.id),
              regional_federation_id: "",
              timezone_id: "",
              city_id: Number(cityId?.id),
              phone_number: phone
          })
      }
  }
  
    return users
  };

  const relateUserToCity = async (jsonArray) => {
    const insertStatements = [];

  for (const item of jsonArray["Players"]) {
            const firstName = item['FirstName']
            const lastName = item["LastName"]
            const nickName = item["Nickname"]
            const cityId = item["CityId"]

            const sqlStatement = `UPDATE users SET city_id = "${cityId}" WHERE first_name = "${firstName}" AND name = "${nickName}" AND last_name = "${lastName}";`;
            insertStatements.push(sqlStatement);
            }
            const sqlContent = insertStatements.join('\n');
  
    return sqlContent
  };

export default async function handler(req, res) {
    try {
        const parsedUsersArray = parseJsonFile(
            ".../../../../../../../python/initial_data_seeding/Players_202407291522.json",
          );

          // const emailsArray = extractEmails(parsedUsersArray)
          // console.log("emailsArray", emailsArray)

        // const missingUserEmails = await getNonExistingEmails(emailsArray)
        // const users = await extractUserInfo(parsedUsersArray,missingUserEmails )
        const sqlContent = await relateUserToCity(parsedUsersArray)
        fs.writeFileSync('update_cities.sql', sqlContent, 'utf8');
        // console.log("users!!!", users)


    }catch (e) {
        console.log("error!!!", e)
    }
}