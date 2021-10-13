const normal_classes = {
    "FilmArts": {
        "start": "8:45",
        "end": "9:42",
        "name": "Film Arts",
        "desc": "Period 1 Film Arts with Mr. McAvoy"
    },
    "Physics": {
        "start": "9:48",
        "end": "10:45",
        "name": "Physics",
        "desc": "Period 2 AP Physics with Mr. Patterson"
    },
    "WritersWorkshop": {
        "start": "10:51",
        "end": "11:48",
        "name": "Writers Workshop",
        "desc": "Period 3 Writers Workshop with Mr. Jason"
    },
    "VideoProduction": {
        "start": "11:54",
        "end": "12:54",
        "name": "Video Production",
        "desc": "Period 4 Video Production with Mr. Liber"
    },
    "Government": {
        "start": "13:36",
        "end": "14:33",
        "name": "Government",
        "desc": "Period 5 AP Government with Mr. Schiller"
    },
    "Calculus": {
        "start": "14:39",
        "end": "15:36",
        "name": "Calculus",
        "desc": "Period 6 AP Calculs with Mr. Huszar"
    },
};

const late_start_classes = {
    "FilmArts": {
        "start": "9:54",
        "end": "10:40",
        "name": "Film Arts",
        "desc": "Period 1 Film Arts with Mr. McAvoy"
    },
    "Physics": {
        "start": "10:46",
        "end": "11:32",
        "name": "Physics",
        "desc": "Period 2 AP Physics with Mr. Patterson"
    },
    "WritersWorkshop": {
        "start": "11:38",
        "end": "12:24",
        "name": "Writers Workshop",
        "desc": "Period 3 Writers Workshop with Mr. Jason"
    },
    "VideoProduction": {
        "start": "12:30",
        "end": "13:16",
        "name": "Video Production",
        "desc": "Period 4 Video Production with Mr. Liber"
    },
    "Government": {
        "start": "13:58",
        "end": "14:44",
        "name": "Government",
        "desc": "Period 5 AP Government with Mr. Schiller"
    },
    "Calculus": {
        "start": "14:50",
        "end": "15:36",
        "name": "Calculus",
        "desc": "Period 6 AP Calculs with Mr. Huszar"
    },
};

class ClassPeriod {

    constructor (normal, late) {
        
        this.normal = {
            start: normal.start,
            end: normal.end
        };
        
        this.late = {
            start: late.start,
            end: late.end
        };
        
        this.name = normal.name;
        this.desc = normal.desc;
        this._padding = 1;

    }
    
    is_weekend (time=new Date()) {
        
        const day = time.getDay();
        
        return day % 6 === 0;
        
    }
    
    is_late_start (time=new Date(), late_start_day=3) {
        const not_late_start = ['9/1', '10/13', '11/10', '1/19', '1/26', '2/23', '3/9', '3/23', '4/13', '5/18', '5/25', '6/8'];
        const utc_month = time.getUTCMonth() + 1;
        const utc_day = time.getUTCDate();
                
        let is_late_start = late_start_day == time.getDay();
        
        return !not_late_start.includes(utc_month + '/' + utc_day) && is_late_start;
    }

    has_started (time=new Date(), late=this.is_late_start()) {
        
        const _time = late ? this.late : this.normal;
        const _start = _time.start;
        const _end = _time.end;

        let hours = time.getHours(),
            mins = time.getMinutes(),
            day = time.getDay(),
            start = _start.split(':').map(e => Number(e)),
            end = _end.split(':').map(e => Number(e));

        start[1] = Math.max(start[1] - this._padding, 0)

        if (!this.is_weekend(time)) {
            if (start[0] > end[0] || ((start[0] == end[0]) && (start[1] > end[1]))) {
                return false;
            } else {
                if (hours > start[0] && hours < end[0]) {
                    return true;
                } else if (hours == start[0] && mins >= start[1]) {
                    return true;  
                } else if (hours == end[0] && mins <= end[1]) {
                    return true;
                }
            }
        }

        return false;
    }

    ends_in (now = new Date(), late_start = this.is_late_start()) {
        
        const time = late_start ? this.late : this.normal;

        const split = time.end.split(':');
        const end_hours = Number(split[0]);
        const end_minutes = Number(split[1]);
        
        const change_hours = end_hours - now.getHours();
        const change_mins = end_minutes - now.getMinutes();
        
        const minutes = (change_hours * 60) + change_mins;
        
        return minutes;
    }
    
    starts_in (now = new Date(), late_start = this.is_late_start()) {
        
        const time = late_start ? this.late : this.normal;
        
        const split = time.start.split(':');
        const start_hours = Number(split[0]);
        const start_minutes = Number(split[1]);
        
        const change_hours = start_hours - now.getHours();
        const change_mins = start_minutes - now.getMinutes();
        
        const minutes = (change_hours * 60) + change_mins;
        
        return minutes;
    }

    print () {
        
        const late_start = this.is_late_start() ? this.late : this.normal;
        const started = this.has_started();
        
        const now = new Date();
        
        
        //console.group(this.name);

        //console.log(this.description);
        
        if (started) {
            
            const minutes = this.ends_in(now, late_start);
            
            //console.log(this.name + ' has started, ends in ' + minutes + ' minutes.');

        } else {
            
            const minutes = this.starts_in(now, late_start);
            
            if (minutes > 0) {
                //console.log(this.name + ' starts in ' + minutes + ' minutes.');
            } else if (minutes < 0) {
                //console.log('Class started ' + Math.abs(minutes) + ' minutes ago.');
            } else {
                //console.log('Class just started');
            }
            
            
        }
        

        //console.groupEnd();
    }
}

const check = cb => {
    const classes = [];

    for (let id in normal_classes) {

        const instance = new ClassPeriod(normal_classes[id], late_start_classes[id]);
        classes.push(instance);

    }

    classes.forEach(period => period.print());

    const current_class = classes.find(period => period.has_started());
    if (current_class) {

        cb('Ends in ' + current_class.ends_in() + ' min');

    } else {

        const sorted = classes
            .filter(e => e.starts_in() >= 0)
            ?.sort((a, b) => a.starts_in() - b.starts_in());

        const nearest = sorted[0];

        cb('Starts in ' + nearest.starts_in() + ' min');

    }
}


const fn = msg => { document.title = msg; };

check(alert);
check(fn);

if (!window.class_time_is_running) setInterval(() => check(fn), 60 * 1000);
else window.class_time_is_running = true;
