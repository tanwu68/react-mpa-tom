/**
 * Created by TanWu on 2017/6/19.
 */
import 'whatwg-fetch';
import 'es6-promise';

export function get(url) {
    var result = fetch(url, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*'
        }
    }).then(resp => {
        return resp.json();
    });

    return result;
}