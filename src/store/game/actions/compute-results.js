/* leny/enigjewo
 *
 * /src/store/game/actions/compute-results.js - Game Store Action: compute results
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

/* global google */

import {
    ACTION_PREPARE_RESULTS,
    ACTION_COMPUTE_RESULTS,
    ACTION_SHOW_RESULTS,
} from "store/game/types";

import {getRandomLatLng} from "core/geo-utils";
import {loadGeoJSON} from "core/maps";

export default (
    pos,
    {settings: {map, difficulty}, rounds, currentRound: {index: round}},
) => async dispatch => {
    const {target} = rounds[`rnd-${round}`];
    dispatch({type: ACTION_PREPARE_RESULTS, now: Date.now()});
    let position = pos,
        geoJSON;
    if (!position) {
        geoJSON = await loadGeoJSON(map);
        position = getRandomLatLng(geoJSON).position;
    }

    dispatch({type: ACTION_COMPUTE_RESULTS, position});
    const distance = Math.floor(
        google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(target),
            new google.maps.LatLng(position),
        ),
    );

    let score;

    if (distance < 50) {
        score = 5000;
    } else {
        score = Math.min(
            5000,
            Math.max(
                0,
                Math.round(5000 * Math.exp(-(distance / 1000 / difficulty))),
            ),
        );
    }

    dispatch({
        type: ACTION_SHOW_RESULTS,
        distance,
        score,
    });
};
