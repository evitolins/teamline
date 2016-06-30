var User = function (name, timezone, avatar) {
  return { name : name, timezone: timezone, avatar: avatar };
};

var in_range = function (val, range) {
    return (val >= range[0] && val <= range[1] );
};

var generate_offset_hours = function (val, pre, post) {
    var r=[], v, i;
    for (i=pre; i<post; i++) {
      v = (val+i) % 24;
      if (v < 0) v = (24000 + v) % 24;
      r.push(v);
    }
    return r;
};


var users = [
    new User('Jimmy', "America/Los_Angeles", 'https://randomuser.me/api/portraits/men/75.jpg'),
    new User('Jane', "America/Chicago", 'https://randomuser.me/api/portraits/men/65.jpg'),
    new User('Frank', "America/New_York", 'https://randomuser.me/api/portraits/men/95.jpg'),
    new User('Bobby', "Europe/London", 'https://randomuser.me/api/portraits/women/75.jpg'),
    new User('Fred', "Europe/Riga", 'https://randomuser.me/api/portraits/women/85.jpg'),
    new User('Carol', "Europe/Sofia", 'https://randomuser.me/api/portraits/women/95.jpg'),
    new User('Miko', "Asia/Tokyo", 'https://randomuser.me/api/portraits/women/98.jpg'),
    new User('Mick', "Australia/Sydney", 'https://randomuser.me/api/portraits/women/99.jpg')
];


var colors = ['#444', '#719dd6', '#84d648', '#5c9631', '#7c49ca'];
var colors = ['#345', '#719dd6', '#f1cb3a', '#af9328', '#345890'];
var color_info = ['sleep', 'early', 'workday', 'after hours', 'late'];

var i,n,t,h,X;


var update_user_data = function (u) {
    moment.locale('en');
    var timezone = moment.tz.guess();
    var currentTime = moment();
    var currentLoc = moment.tz(currentTime, timezone);
    for (i=0; i<u.length; i++) {
        n = u[i].name;
        t = currentLoc.clone().tz(u[i].timezone);
        h = parseInt(t.format('H'), 10);
        u[i].hour = h;
        u[i].time = t.format("dddd, H:mm a");
        u[i].hours = generate_offset_hours(h, 0, 24);
    }
};


var get_time_catatory = function (value) {
    if (value >= 0 && value < 6) return 0;
    if (value >= 6 && value < 9) return 1;
    if (value >= 9 && value < 18) return 2;
    if (value >= 18 && value < 21) return 3;
    if (value >= 21 && value < 24) return 4;
    if (value == 24) return 0;
}
}

Vue.filter('time_color', function (value) {
    var cat = get_time_catatory(value);
    return colors[cat];
});


var elem_footer = document.getElementById('time_key');
var build_swatches = function () {
    var i;
    for(i=0; i<colors.length; i++) {
        elm = document.createElement('div');
        elm.className = 'key_pill';
        elm.style.backgroundColor = colors[i];
        elm.innerHTML = color_info[i];
        elem_footer.appendChild(elm);
    }
};

update_user_data(users);
build_swatches();

new Vue({
  el: '#app',
  data: {
      users: users
  }
});