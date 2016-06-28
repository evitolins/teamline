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

var generate_offset_ranges = function (val, pre, post) {
    var r=[], v, i;
    for (i=pre; i<post; i++) {
      v = (val+i) % 24;
      if (v < 0) v = (24000 + v) % 24;
      r.push(v);
    }
    return r;
};


var users = [
    new User('mick', "Australia/Sydney"),
    new User('jane', "America/Los_Angeles"),
    new User('frank', "America/New_York"),
    new User('bobby', "Europe/London"),
    new User('fred', "Europe/Riga"),
    new User('carol', "Asia/Kuala_Lumpur"),
    new User('miko', "Asia/Tokyo")
];
var colors = ['#222', '#719dd6', '#84d648', '#5c9631', '#7c49ca'];
var color_info = ['sleep', 'early', 'workday', 'after hours', 'late'];

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
    users[i].hours = generate_offset_ranges(h, -12, 12);
}

Vue.filter('time_color', function (value) {
    if (value >= 0 && value < 6) return colors[0];
    if (value >= 6 && value < 9) return colors[1];
    if (value >= 9 && value < 18) return colors[2];
    if (value >= 18 && value < 21) return colors[3];
    if (value >= 21 && value < 24) return colors[4];
    if (value == 24) return colors[0];
});

var build_swatches = function () {
    var i;
    for(i=0; i<colors.length; i++) {
        elm = document.createElement('div');
        elm.style.fontSize = '0.5em';
        elm.style.width = '50px';
        elm.style.height = '2em';
        elm.style.color = '#fff';
        elm.style.padding = '0px 8px';    
        elm.style.backgroundColor = colors[i];
        elm.style.borderRadius = '20px';
        elm.style.lineHeight = '2em';
        elm.innerHTML = color_info[i];
        document.body.appendChild(elm);
    }
};

build_swatches();

new Vue({
  el: '#app',
  data: {
      users: users
  }
});