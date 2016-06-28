var User = function (name, timezone) {
  return { name : name, timezone: timezone };
};

var in_range = function (val, range) {
    return (val >= range[0] && val <= range[1] );
};
var in_some_ranges = function (val, ranges) {
    var i;
    for (i=0; i<ranges.length; i++) {
        if (in_range(val, ranges[i])) {
            return true;
        }
    }
    return false;
};
var sleep_ranges = [[0,6], [22,24]];

var users = [
    new User('mick', "Australia/Sydney"),
    new User('jane', "America/Los_Angeles"),
    new User('frank', "America/New_York"),
    new User('bobby', "Europe/London"),
    new User('fred', "Europe/Riga"),
    new User('carol', "Asia/Kuala_Lumpur"),
    new User('miko', "Asia/Tokyo")
];
var i,n,t,h,X;

var avatars = [
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg',
    'https://randomuser.me/api/portraits/men/95.jpg',
    'https://randomuser.me/api/portraits/women/75.jpg',
    'https://randomuser.me/api/portraits/women/85.jpg',
    'https://randomuser.me/api/portraits/women/95.jpg',
    'https://randomuser.me/api/portraits/women/98.jpg',
];

moment.locale('en');
var timezone = moment.tz.guess();
var currentTime = moment();
var currentLoc = moment.tz(currentTime, timezone);
for (i=0; i<users.length; i++) {
    n = users[i].name;
    t = currentLoc.clone().tz(users[i].timezone);
    h = parseInt(t.format('H'), 10);
    X = (in_some_ranges(h, sleep_ranges)) ? '* SLEEP' : '';
    users[i].avatar = avatars[i];
    users[i].hour = h;
    users[i].time = t.format("dddd, ha");
}


Vue.filter('time_color', function (value) {
    var colors = ['#446', '#cc4', '#60c', '#46f'];
    if (value >= 0 && value < 6) return colors[0];
    if (value >= 6 && value < 12) return colors[1];
    if (value >= 12 && value < 18) return colors[2];
    if (value >= 18 && value < 24) return colors[3];
});


new Vue({
  el: '#app',
  data: {
      users: users
  }
});