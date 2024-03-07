function getMonthIndex(monthName) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months.indexOf(monthName);
}


function parseTimeStamp(dateString) {
    const [date, time] = dateString.split(" • ");

    // Parse the date
    const dateComponents = date.split(" ");
    const month = getMonthIndex(dateComponents[0]);
    const day = parseInt(dateComponents[1].replace(",", ""));
    const year = parseInt(dateComponents[2]);

    // Parse the time
    const timeComponents = time.split(" ");
    const [hour, minute] = timeComponents[0].split(":");
    const isPM = timeComponents[1] === "PM";

    // Adjust the hour if PM
    let hourInt = parseInt(hour);
    if (isPM && hourInt !== 12) {
        hourInt += 12;
    }

    const dateTimeStamp = new Date(year, month, day, hourInt, parseInt(minute));

    return dateTimeStamp;


}

function extractStories(html) {
    const allLatestStories = [];

    const startIndex = html.indexOf('<li class="latest-stories__item">');
    const endIndex = html.indexOf('</ul>', startIndex);
    if (startIndex === -1 || endIndex === -1) {
        return { statusCode: 404, message: 'Error! Unable to find latest stories section in HTML' };
    }

    const latestStoriesSection = html.substring(startIndex, endIndex);

    const storyElements = latestStoriesSection.split('<li class="latest-stories__item">');
    storyElements.shift();

    storyElements.forEach(storyElement => {

        //extracting title
        const titleStartInd = storyElement.indexOf('<h3 class="latest-stories__item-headline">') + '<h3 class="latest-stories__item-headline">'.length;
        const titleEndInd = storyElement.indexOf('</h3>', titleStartInd);

        const title = storyElement.substring(titleStartInd, titleEndInd).trim();


        //extracting link
        const linkStartInd = storyElement.indexOf('href="') + 'href="'.length;
        const linkEndInd = storyElement.indexOf('"', linkStartInd);
        const link = 'https://time.com' + storyElement.substring(linkStartInd, linkEndInd);


        //extracting date and time of news
        const timeStartInd = storyElement.indexOf('<time class="latest-stories__item-timestamp"') + '<time class="latest-stories__item-timestamp">'.length;
        const timeEndInd = storyElement.indexOf('</time>', timeStartInd);
        const timeStampInString = storyElement.substring(timeStartInd, timeEndInd).trimStart();


        const timeStamp = parseTimeStamp(timeStampInString);

        allLatestStories.push({ title, link, timeStamp });
    });


    const sortedStories = allLatestStories.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    const latestStories = sortedStories.slice(0, 6);

    const Latest6Stories = latestStories.map(item => ({
        title: item.title,
        link: item.link
    }));
    var msg = "Success! Latest 6 Stories extracted successfully!";
    if (sortedStories.length < 6)
        msg += ` Only ${sortedStories.length} latest stories found`;

    return { statusCode: 200, data: Latest6Stories, message: msg };
}

module.exports = extractStories;
