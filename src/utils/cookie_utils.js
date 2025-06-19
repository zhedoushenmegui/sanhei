export default {
    set: function (name, value, days, path='/') {
        let d = new Date;
        d.setTime(d.getTime() + 24*60*60*1000*days);
        window.document.cookie = name + "=" + value + ";path="+path+";expires=" + d.toGMTString();
    },
    get: function (name) {
        let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    delete: function (name, path='/') {
        this.set(name, '', -1, path);
    }
};
