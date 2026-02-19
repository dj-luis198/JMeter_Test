/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.16417910447761, "KoPercent": 32.83582089552239};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4198895027624309, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4363e0d4-f396-4d1b-8b42-f66e8f7fe050"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b55a23ee-ab45-4078-b414-69f385d16eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba4b224-1eb2-4325-a707-5c4f661dc66e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4363e0d4-f396-4d1b-8b42-f66e8f7fe050"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d0cfc28-158a-44aa-844c-ba113d21777a"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6970a2d6-a613-4c95-95fa-77c4bac18488"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48f021b1-8b2a-4362-a1e7-c91b445c53bf"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48f021b1-8b2a-4362-a1e7-c91b445c53bf"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.79, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/10b07b0b-6dc2-4a56-b60f-cfe55584349e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d0cfc28-158a-44aa-844c-ba113d21777a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ea18128-d1c1-455b-b826-4f30decb0798"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beaff4a2-d7a2-4d2e-83d8-b8d76a3b78ba"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/41eb924c-3727-4a50-b57e-d3e070ecf2a9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6970a2d6-a613-4c95-95fa-77c4bac18488"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd4e78e1-c78b-474c-bb59-8433571482c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c50cae17-091a-40ed-9ca8-9255da03d510"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd4e78e1-c78b-474c-bb59-8433571482c0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e687ca4-a332-47d9-9958-51093cae2fc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00bc47d7-265f-4bc9-ba15-f1a355b4bea6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/beaff4a2-d7a2-4d2e-83d8-b8d76a3b78ba"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41eb924c-3727-4a50-b57e-d3e070ecf2a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29fd9a6b-20ef-430e-b6d4-d5c00d8e8c68"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3ac0037-3268-4daf-a255-34468ccb7c5e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6e687ca4-a332-47d9-9958-51093cae2fc1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fba4b224-1eb2-4325-a707-5c4f661dc66e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3ac0037-3268-4daf-a255-34468ccb7c5e"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 536, 176, 32.83582089552239, 1295.7425373134336, 1, 26673, 118.0, 2914.200000000014, 8415.899999999998, 19930.589999999993, 2.1000748347562386, 2.2645870228304776, 0.9917181604559042], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4363e0d4-f396-4d1b-8b42-f66e8f7fe050", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["see books", 54, 54, 100.0, 3527.351851851851, 434, 21930, 762.0, 8964.5, 15318.5, 21930.0, 0.2314021254713747, 1.4889104749635755, 0.388457278989544], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 167.85, 103, 438, 109.5, 330.0, 432.6499999999999, 438.0, 0.10616218396844859, 0.05277006996087924, 0.053288439999787676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 8, 0, 0.0, 413.62500000000006, 105, 2547, 110.0, 2547.0, 2547.0, 2547.0, 0.097128634735628, 0.07540748497541432, 0.034526194378680264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b55a23ee-ab45-4078-b414-69f385d16eab", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba4b224-1eb2-4325-a707-5c4f661dc66e", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 136.66666666666666, 103, 320, 109.0, 318.2, 320.0, 320.0, 0.1072485735939712, 0.053310081991534516, 0.05383375666728633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 2.705705275229358, 4.103354357798165], "isController": false}, {"data": ["https://demoqa.com/books", 54, 54, 100.0, 196.90740740740745, 104, 712, 109.5, 440.0, 462.75, 712.0, 0.23101110136681569, 0.11482876034737224, 0.11167040544587281], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 2934.0909090909095, 110, 15056, 446.0, 14394.800000000003, 15056.0, 15056.0, 0.07695859627520393, 0.014703027271328026, 0.05077736927532987], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 2934.0909090909095, 110, 15056, 446.0, 14394.800000000003, 15056.0, 15056.0, 0.0797980384191283, 0.015245505919563576, 0.05265083642852997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 2642.7619047619046, 152, 20837, 964.0, 11257.600000000006, 20022.49999999999, 20837.0, 0.09151044526368081, 0.028903410725024184, 0.04128693917169974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4363e0d4-f396-4d1b-8b42-f66e8f7fe050", 3, 0, 0.0, 275.3333333333333, 186, 451, 189.0, 451.0, 451.0, 451.0, 0.018475750577367205, 0.021837711701308698, 0.011848056197074673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 136.66666666666666, 109, 324, 112.0, 324.0, 324.0, 324.0, 0.04524045300773612, 0.03560918469163604, 0.016081567280093696], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 2746.0, 106, 12668, 675.0, 12014.400000000001, 12668.0, 12668.0, 0.07862140932449914, 0.016465545507501195, 0.051686038356526645], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 1, 4.761904761904762, 1418.3333333333335, 1, 8406, 1063.0, 1845.6000000000001, 7754.799999999991, 8406.0, 0.09186874144198927, 0.054115576071692616, 0.04024384041962142], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 1325.7272727272725, 107, 9131, 246.0, 7745.800000000005, 9131.0, 9131.0, 0.07749862616071806, 0.14287433157434937, 0.0482990372557032], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 157.11111111111111, 107, 320, 111.0, 320.0, 320.0, 320.0, 0.046351135602822266, 0.02303977345882474, 0.0232660973631354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d0cfc28-158a-44aa-844c-ba113d21777a", 3, 0, 0.0, 420.0, 189, 825, 246.0, 825.0, 825.0, 825.0, 0.024473014422763166, 0.020402145161685047, 0.015693957816680808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6970a2d6-a613-4c95-95fa-77c4bac18488", 3, 0, 0.0, 6270.0, 279, 9400, 9131.0, 9400.0, 9400.0, 9400.0, 0.02061572292468389, 0.017186479951209456, 0.013220369193238043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48f021b1-8b2a-4362-a1e7-c91b445c53bf", 3, 0, 0.0, 577.6666666666666, 195, 1174, 364.0, 1174.0, 1174.0, 1174.0, 0.04126717746261881, 0.03440274787817929, 0.02646365221398407], "isController": false}, {"data": ["addBook", 48, 48, 100.0, 5258.916666666669, 432, 37808, 761.5, 24433.7, 24863.45, 37808.0, 0.21937341468430793, 0.7506817928635086, 0.4269819302575352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48f021b1-8b2a-4362-a1e7-c91b445c53bf", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 2704.066666666667, 105, 14126, 113.0, 12686.6, 14126.0, 14126.0, 0.11172685019663925, 0.08346781289104398, 0.039715403780836614], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 4482.636363636364, 109, 18927, 413.0, 18348.600000000002, 18927.0, 18927.0, 0.07994186046511627, 0.015272983284883721, 0.05335608194040698], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 150, 5, 3.3333333333333335, 1847.133333333334, 104, 26673, 129.5, 7203.100000000004, 10217.149999999994, 25439.82000000002, 0.5981719864095325, 1.4109187011991353, 0.28120314319439793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 1681.6666666666667, 109, 7598, 115.0, 7598.0, 7598.0, 7598.0, 0.048554164868364266, 0.037601028067004744, 0.017259488293051357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10b07b0b-6dc2-4a56-b60f-cfe55584349e", 1, 0, 0.0, 5273.0, 5273, 5273, 5273.0, 5273.0, 5273.0, 5273.0, 0.18964536317087047, 0.060560579840697897, 0.11315753603261901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 7, 100.0, 108.57142857142857, 105, 112, 109.0, 112.0, 112.0, 112.0, 0.04282419444631375, 0.021286635715989943, 0.021495738227934835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d0cfc28-158a-44aa-844c-ba113d21777a", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 2292.571428571429, 108, 14541, 111.5, 10062.0, 14541.0, 14541.0, 0.07654790805502702, 0.06212042147824946, 0.027210389191435383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ea18128-d1c1-455b-b826-4f30decb0798", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 1400.1904761904764, 118, 14296, 470.0, 5324.600000000004, 13507.799999999988, 14296.0, 0.09129323386718138, 0.05607758213130576, 0.041278093047368146], "isController": false}, {"data": ["login", 21, 5, 23.80952380952381, 3321.047619047619, 1185, 22881, 1868.0, 6686.2, 21265.599999999977, 22881.0, 0.09113396693138914, 0.1426214373670963, 0.1340013439547802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beaff4a2-d7a2-4d2e-83d8-b8d76a3b78ba", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 152.55555555555554, 106, 322, 113.0, 322.0, 322.0, 322.0, 0.04708886191452848, 0.023406475307124024, 0.023636401390691057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 709.7999999999998, 108, 8472, 113.0, 2220.400000000003, 8166.199999999995, 8472.0, 0.10665244634048793, 0.0863426543127583, 0.03791161178509532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41eb924c-3727-4a50-b57e-d3e070ecf2a9", 3, 0, 0.0, 5045.333333333334, 263, 12668, 2205.0, 12668.0, 12668.0, 12668.0, 0.031952965235173825, 0.020542677844879002, 0.02049067106552488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 8, 8, 100.0, 161.49999999999997, 104, 322, 110.5, 322.0, 322.0, 322.0, 0.10535603755942739, 0.052369358513426306, 0.05288379229057195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6970a2d6-a613-4c95-95fa-77c4bac18488", 1, 0, 0.0, 16035.0, 16035, 16035, 16035.0, 16035.0, 16035.0, 16035.0, 0.06236357966947303, 0.011266857655129404, 0.042996764889304644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd4e78e1-c78b-474c-bb59-8433571482c0", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c50cae17-091a-40ed-9ca8-9255da03d510", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 843.4285714285714, 109, 5237, 111.0, 5237.0, 5237.0, 5237.0, 0.042096400757735214, 0.03490219164386445, 0.01496395495685119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd4e78e1-c78b-474c-bb59-8433571482c0", 3, 0, 0.0, 282.0, 183, 468, 195.0, 468.0, 468.0, 468.0, 0.0223063253303195, 0.02237167589281067, 0.01430451201195619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e687ca4-a332-47d9-9958-51093cae2fc1", 1, 0, 0.0, 18927.0, 18927, 18927, 18927.0, 18927.0, 18927.0, 18927.0, 0.05283457494584456, 0.009545308950176997, 0.036426962804459236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00bc47d7-265f-4bc9-ba15-f1a355b4bea6", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, 100.0, 120.39999999999999, 105, 323, 109.0, 117.60000000000001, 312.7499999999999, 323.0, 0.08755379086025977, 0.04352039018346897, 0.04394789892790383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beaff4a2-d7a2-4d2e-83d8-b8d76a3b78ba", 3, 0, 0.0, 481.33333333333337, 233, 927, 284.0, 927.0, 927.0, 927.0, 0.02000786976210643, 0.020066486568050098, 0.012830567523225802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 1428.5, 106, 10638, 114.0, 8226.000000000002, 10521.599999999999, 10638.0, 0.08823944656219117, 0.0685062109540449, 0.031366365770153885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41eb924c-3727-4a50-b57e-d3e070ecf2a9", 1, 0, 0.0, 11105.0, 11105, 11105, 11105.0, 11105.0, 11105.0, 11105.0, 0.09004952723998198, 0.01626871341737956, 0.062084927960378206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29fd9a6b-20ef-430e-b6d4-d5c00d8e8c68", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, 100.0, 110.5, 104, 125, 109.0, 122.0, 125.0, 125.0, 0.07779420099798846, 0.03866918780075794, 0.03904904229781843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 150.7142857142857, 103, 418, 107.0, 418.0, 418.0, 418.0, 0.07153148918341697, 0.035556179681991436, 0.03527675980236872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3ac0037-3268-4daf-a255-34468ccb7c5e", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e687ca4-a332-47d9-9958-51093cae2fc1", 3, 0, 0.0, 1836.3333333333335, 189, 3771, 1549.0, 3771.0, 3771.0, 3771.0, 0.02164033758926639, 0.018040659038447666, 0.013877430029575128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fba4b224-1eb2-4325-a707-5c4f661dc66e", 3, 0, 0.0, 386.33333333333337, 199, 675, 285.0, 675.0, 675.0, 675.0, 0.07470677590457454, 0.03380287060786413, 0.04790766553776428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3ac0037-3268-4daf-a255-34468ccb7c5e", 3, 0, 0.0, 345.0, 200, 551, 284.0, 551.0, 551.0, 551.0, 0.05259282633848743, 0.03381211979769293, 0.03372651949440763], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 2642.7619047619046, 152, 20837, 964.0, 11257.600000000006, 20022.49999999999, 20837.0, 0.09104822520995287, 0.02875741934644717, 0.04107839848339671], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.840909090909091, 0.9328358208955224], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, 0.5681818181818182, 0.1865671641791045], "isController": false}, {"data": ["401/Unauthorized", 7, 3.977272727272727, 1.3059701492537314], "isController": false}, {"data": ["404/Not Found", 163, 92.61363636363636, 30.41044776119403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 536, 176, "404/Not Found", 163, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 54, 54, "404/Not Found", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 150, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
