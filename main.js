Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

var remap_range = function (value, low1, high1, low2, high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
};

var in_range = function (val, range) {
    return (val >= range[0] && val <= range[1] );
};

var elemCoords = function (e, elem) {
    var rect = elem.getBoundingClientRect(),
        offset = {
            left: rect.left + document.body.scrollLeft,
            top: rect.top + document.body.scrollTop
        };
    return {
        x : (e.pageX - offset.left),
        y : (e.pageY - offset.top)
    };
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


var User = function (name, timezone, avatar) {
  return { name : name, timezone: timezone, avatar: avatar };
};

var users = [
    new User('Jimmy', "America/Los_Angeles", 'https://randomuser.me/api/portraits/men/75.jpg'),
    new User('Jane', "America/Chicago", 'https://randomuser.me/api/portraits/women/65.jpg'),
    new User('Frank', "America/New_York", 'https://randomuser.me/api/portraits/men/95.jpg'),
    new User('Bobby', "Europe/London", 'https://randomuser.me/api/portraits/women/75.jpg'),
    new User('Fred', "Europe/Riga", 'https://randomuser.me/api/portraits/men/14.jpg'),
    new User('Carol', "Europe/Sofia", 'https://randomuser.me/api/portraits/women/95.jpg'),
    new User('Getoo', "Asia/Calcutta", 'https://randomuser.me/api/portraits/men/99.jpg'),
    new User('Miko', "Asia/Tokyo", 'https://randomuser.me/api/portraits/women/98.jpg'),
    new User('Mick', "Australia/Sydney", 'https://randomuser.me/api/portraits/men/47.jpg'),
];


var palletes = [
    {
        name : "Sunlight",
        colors : [
                {'name' : 'sleep', color: '#345'},
                {'name' : 'early', color: '#719dd6'},
                {'name' : 'workday', color: '#f1cb3a'},
                {'name' : 'after hours', color: '#ceac2d'},
                {'name' : 'late', color: '#345890'},
            ]
    },
    {
        name : "Go Time",
        colors : [
                {'name' : 'piss off', color: '#444'},
                {'name' : 'early', color: '#719dd6'},
                {'name' : 'time to ROCK!!!', color: '#84d648'},
                {'name' : 'after hours', color: '#5c9631'},
                {'name' : 'late', color: '#7c49ca'},
            ]
    },
];



var update_user_data = function (u, hour_offset) {
    moment.locale('en');
    var timezone = moment.tz.guess();
    var currentTime = moment().add(hour_offset || 0, 'hour').startOf('hour');
    var currentLoc = moment.tz(currentTime, timezone);
    var i,n,t,h;
    for (i=0; i<u.length; i++) {
        // Show exact time if no offset is given.  Otherwise it's rounded to
        // the nearest hour
        if (i==0 && ((hour_offset % 24) == 0 && !hour_offset || hour_offset === undefined)) {
            currentTime = moment().add(hour_offset || 0, 'hour');
            currentLoc = moment.tz(currentTime, timezone);
        }
        n = u[i].name;
        t = currentLoc.clone().tz(u[i].timezone);
        h = parseInt(t.format('H'), 10);
        u[i].hour = h;
        u[i].time = t.format("dddd Do, H:mm");
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
};

var get_rating = function (value) {
    if (value >= 0 && value < 6) return 0;
    if (value >= 6 && value < 9) return 1;
    if (value >= 9 && value < 18) return 3;
    if (value >= 18 && value < 21) return 2;
    if (value >= 21 && value < 24) return 1;
    if (value == 24) return 0;
};

var calc_column_strength = function () {
    var strengths = [];
    var column_totals = [];
    for (i=0; i<users.length; i++) {
        strengths[i] = [];
        for (ii=0; ii<users[i].hours.length; ii++) {
            strengths[i][ii] = get_rating(users[i].hours[ii]);
        }
    }
    for (i=0; i<24; i++) {
        column_totals.push(strengths.reduce(
           function(sum, current){
             return sum + current[i];
           }, 0
        ));
    }

    var adjusted_totals = [];
    var min = Array.min(column_totals);
    var max = Array.max(column_totals);
    for (i=0; i<column_totals.length; i++) {
        adjusted_totals.push(remap_range(column_totals[i], min, max, 3, 20));
    }


    return adjusted_totals;
}



Vue.filter('time_color', function (value) {
    var cat = get_time_catatory(value);
    return this.color_levels[cat].color;
});




update_user_data(users);
calc_column_strength();

var ui = new Vue({
  el: '#app',
  data: {
      users: users,
      color_levels: palletes[0].colors,
      range: 0,
      percentage: 0,
      column_strength: calc_column_strength(),
      current_pallete: 0,
      palletes: palletes,
  },
  watch: {
    users: 'updateUsers',
    range: 'update',
    current_pallete: 'update'
  },
  methods: {
    'updateUsers' :  function () {
        update_user_data(this.users, this.range );
        this.column_strength = calc_column_strength()
    },
    'showPercentage' : function (e) {
        var coords = elemCoords(e, e.currentTarget);
        var p = parseInt(coords.x, 10) / parseInt(e.currentTarget.offsetWidth, 10);
        this.percentage = Math.floor(p * 24);
    },
    'update' : function (e) {
        console.log(this.current_pallete);
        this.color_levels = palletes[parseInt(this.current_pallete,10)].colors;
        update_user_data(this.users, this.range);
    }
  }
});