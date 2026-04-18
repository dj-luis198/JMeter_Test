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

    var data = {"OkPercent": 98.586017282011, "KoPercent": 1.4139827179890023};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7780766644250168, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12962962962962962, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f263e85c-0f26-4ce0-9abf-64b481f3d9b4"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3647f09-24a8-4e93-a636-896b1c31dd71"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbc56bdb-d575-43b0-8cf4-74ce05e8dcf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed67e396-62ce-43f4-ac98-af7f0ba4b0e1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56edebe9-4d8e-4700-b707-cc75a1b0b9e0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fa2be58-5789-4a68-8126-dc84dfb9cbef"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=435b74fd-042b-462e-9b83-5c5289375bd2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/96b01c31-7961-45a9-bb7f-f2c72a21091d"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d521c04-704d-4c24-8a89-a3bc5c2e2747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00de8e38-8576-42a5-9464-946315f836e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18bf9201-5d07-4d23-9d15-c69ae66d1b2f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f3647f09-24a8-4e93-a636-896b1c31dd71"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8acf9599-b150-4dce-89b1-0eeaecca3d4a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3edcba2a-bd06-490b-8d0e-7a9bab118781"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0a3649d-bc9d-4e34-9f99-4e20a6b2f442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3edcba2a-bd06-490b-8d0e-7a9bab118781"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4537037037037037, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e39ccc0-bec0-474d-bd8f-86004626866b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f263e85c-0f26-4ce0-9abf-64b481f3d9b4"], "isController": false}, {"data": [0.32456140350877194, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bbc56bdb-d575-43b0-8cf4-74ce05e8dcf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed67e396-62ce-43f4-ac98-af7f0ba4b0e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5370370370370371, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9613095238095238, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00de8e38-8576-42a5-9464-946315f836e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09271c9f-5f0e-4ac1-963c-c1d8f00ffab4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18bf9201-5d07-4d23-9d15-c69ae66d1b2f"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e39ccc0-bec0-474d-bd8f-86004626866b"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/435b74fd-042b-462e-9b83-5c5289375bd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8acf9599-b150-4dce-89b1-0eeaecca3d4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d521c04-704d-4c24-8a89-a3bc5c2e2747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e64621cd-7104-4072-9ff9-ff4fc80b6411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d626a8c4-e36a-4462-936c-381ea007e94f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0a3649d-bc9d-4e34-9f99-4e20a6b2f442"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 18, 1.4139827179890023, 364.2545168892382, 97, 2795, 130.0, 995.6000000000001, 1206.3, 1612.52, 4.996742108444612, 698.2065466447642, 3.6427499278749913], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1674.9629629629628, 1204, 2491, 1703.0, 1931.0, 2045.75, 2491.0, 0.23375611445391972, 281.28686680906674, 1.1493769885502791], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f263e85c-0f26-4ce0-9abf-64b481f3d9b4", 3, 0, 0.0, 364.0, 207, 556, 329.0, 556.0, 556.0, 556.0, 0.0758955676988464, 0.03359960028334345, 0.04867000923396074], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 555.0714285714286, 104, 1291, 493.5, 1098.0, 1291.0, 1291.0, 0.11348805538217102, 0.022355626980974538, 0.07636061538898031], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 555.0714285714286, 104, 1291, 493.5, 1098.0, 1291.0, 1291.0, 0.11570630434063936, 0.022792592317101394, 0.07785316766669972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 115.78571428571426, 100, 302, 101.5, 203.5, 302.0, 302.0, 0.07342105401167394, 0.019645867967967443, 0.041872944866032796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 131.8571428571429, 99, 303, 104.0, 301.5, 303.0, 303.0, 0.0734187438052935, 0.05456217190998862, 0.036852767886641456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 171.57142857142856, 99, 304, 101.5, 303.0, 304.0, 304.0, 0.07342105401167394, 0.019789268464083992, 0.043235249579140024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 172.92857142857144, 100, 304, 103.5, 303.5, 304.0, 304.0, 0.07342066896718097, 0.019789164682560496, 0.04316332296703412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3647f09-24a8-4e93-a636-896b1c31dd71", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 245.73333333333332, 101, 367, 277.0, 352.6, 367.0, 367.0, 0.10856113077273813, 0.2139983019229795, 0.07016893921300418], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 125.05882352941175, 100, 305, 102.0, 297.8, 305.0, 305.0, 0.09575199107816743, 0.07115943868211465, 0.04806301114665826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 136.9411764705882, 99, 304, 103.0, 296.8, 304.0, 304.0, 0.09575360906617701, 0.025621571175910646, 0.05460948017055408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 756.4, 599, 811, 787.0, 811.0, 811.0, 811.0, 0.059966418805468935, 17.632118201307268, 0.03419959822499401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 987.2, 900, 1121, 905.0, 1121.0, 1121.0, 1121.0, 0.05988167381254641, 53.881635357284004, 0.03409278889913531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbc56bdb-d575-43b0-8cf4-74ce05e8dcf2", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 265.2, 102, 314, 304.0, 314.0, 314.0, 314.0, 0.060312175822054954, 0.10672427987262069, 0.03339551141709488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 150.42857142857144, 100, 306, 105.5, 304.5, 306.0, 306.0, 0.07879422325780344, 0.058557035057801195, 0.03955100659620212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 144.2857142857143, 98, 305, 102.0, 304.0, 305.0, 305.0, 0.07879422325780344, 0.03799007192786952, 0.043991975652585016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 258.2857142857143, 100, 1100, 102.0, 1001.5, 1100.0, 1100.0, 0.07835411582977007, 10.089983493166402, 0.045101713436611526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed67e396-62ce-43f4-ac98-af7f0ba4b0e1", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 229.0, 98, 799, 103.0, 791.5, 799.0, 799.0, 0.07848633496846531, 3.3149307988787666, 0.04525446741415557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 103.2, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.06046095431570292, 0.044932408431884695, 0.03395024290188397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56edebe9-4d8e-4700-b707-cc75a1b0b9e0", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 921.4615384615387, 98, 1400, 1088.0, 1350.0, 1400.0, 1400.0, 0.06863635403687356, 47.51127838839201, 0.03581341009165593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 136.11764705882354, 99, 304, 102.0, 300.8, 304.0, 304.0, 0.09564855345628862, 0.02578027417376529, 0.05623088787176342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 614.6153846153846, 99, 917, 784.0, 910.2, 917.0, 917.0, 0.06863454218120575, 15.52798771441695, 0.03587949061290646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 172.70588235294122, 98, 309, 102.0, 307.4, 309.0, 309.0, 0.09564586275381318, 0.025779548945363707, 0.05632271019584897], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 533.5, 104, 955, 556.0, 947.0, 955.0, 955.0, 0.11603427984153032, 0.022857199098247884, 0.0788184861256154], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6fa2be58-5789-4a68-8126-dc84dfb9cbef", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 425.1428571428571, 203, 1209, 214.0, 1207.5, 1209.0, 1209.0, 0.07830941167257716, 13.48763812521675, 0.17325738835315307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=435b74fd-042b-462e-9b83-5c5289375bd2", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b01c31-7961-45a9-bb7f-f2c72a21091d", 2, 0, 0.0, 422.0, 301, 543, 422.0, 543.0, 543.0, 543.0, 0.08001920460910618, 0.049191493458430026, 0.04973849973993759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 596.4782608695652, 110, 1347, 528.0, 1147.8000000000002, 1317.3999999999996, 1347.0, 0.10085197998745928, 0.06194911661339052, 0.04560006517011098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 103.30769230769229, 100, 106, 104.0, 105.6, 106.0, 106.0, 0.06863345511372036, 0.05100591732572382, 0.034450777273879164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 188.0, 101, 411, 103.0, 369.79999999999995, 411.0, 411.0, 0.0686349045446866, 0.09766243704067411, 0.03470929818170299], "isController": false}, {"data": ["login", 23, 0, 0.0, 2493.3913043478256, 1278, 4252, 2437.0, 3430.0, 4096.799999999997, 4252.0, 0.09873278615337065, 25.81441049953424, 0.18455803797563447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d521c04-704d-4c24-8a89-a3bc5c2e2747", 1, 0, 0.0, 939.0, 939, 939, 939.0, 939.0, 939.0, 939.0, 1.0649627263045793, 0.19240049254526093, 0.734241879659212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 107.70588235294117, 103, 119, 107.0, 117.4, 119.0, 119.0, 0.0949360019657337, 0.07685736877889963, 0.033746781948756896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00de8e38-8576-42a5-9464-946315f836e3", 3, 0, 0.0, 1103.6666666666665, 192, 2795, 324.0, 2795.0, 2795.0, 2795.0, 0.09577320904099093, 0.045018396437236624, 0.06141706439152088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18bf9201-5d07-4d23-9d15-c69ae66d1b2f", 3, 0, 0.0, 317.33333333333337, 185, 581, 186.0, 581.0, 581.0, 581.0, 0.024345511499196597, 0.0244168362399169, 0.01561219324655511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3647f09-24a8-4e93-a636-896b1c31dd71", 3, 0, 0.0, 500.6666666666667, 343, 651, 508.0, 651.0, 651.0, 651.0, 0.026654346435425403, 0.022220631907918117, 0.01709279377532163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1026.4615384615386, 204, 1505, 1192.0, 1455.8, 1505.0, 1505.0, 0.06859579138436861, 63.15100559616339, 0.14077286845174022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8acf9599-b150-4dce-89b1-0eeaecca3d4a", 3, 0, 0.0, 452.66666666666663, 267, 724, 367.0, 724.0, 724.0, 724.0, 0.03325647392692444, 0.027724553947543456, 0.021326579959648814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 348.21428571428567, 203, 606, 398.0, 602.5, 606.0, 606.0, 0.07337949252839525, 0.11372388148687818, 0.16503219852821704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 652.1111111111111, 101, 1226, 1001.0, 1226.0, 1226.0, 1226.0, 0.09781439175750725, 65.02275373324929, 0.15133847787221094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3edcba2a-bd06-490b-8d0e-7a9bab118781", 3, 0, 0.0, 348.3333333333333, 196, 572, 277.0, 572.0, 572.0, 572.0, 0.028218827601775905, 0.028301499948265484, 0.01809605806494093], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1102.478260869565, 474, 2141, 1062.0, 1646.4, 2046.3999999999987, 2141.0, 0.09952358492607129, 0.031506787075780716, 0.04490224241781732], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0a3649d-bc9d-4e34-9f99-4e20a6b2f442", 1, 0, 0.0, 877.0, 877, 877, 877.0, 877.0, 877.0, 877.0, 1.1402508551881414, 0.20600235176738882, 0.7861495153933865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 129.89473684210526, 100, 330, 106.0, 300.0, 330.0, 330.0, 0.10301788173547177, 0.07997970310517584, 0.036619637648155984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 323.70588235294116, 204, 606, 214.0, 597.2, 606.0, 606.0, 0.0955910054486873, 0.14814738832721364, 0.21498641166828797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3edcba2a-bd06-490b-8d0e-7a9bab118781", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 380.16666666666663, 201, 1516, 215.0, 1033.6000000000008, 1516.0, 1516.0, 0.12909426032574783, 17.338020321588147, 0.2866660197012185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 133.9230769230769, 100, 309, 103.0, 307.4, 309.0, 309.0, 0.06046736622758056, 0.04493717353436407, 0.030351783438453524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 148.46153846153848, 99, 303, 103.0, 303.0, 303.0, 303.0, 0.06046764748291789, 0.016179819736640136, 0.03448545520510161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 151.46153846153845, 102, 305, 104.0, 304.6, 305.0, 305.0, 0.06046736622758056, 0.016297844803527573, 0.03554819772363623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 119.46153846153847, 98, 304, 102.0, 234.39999999999992, 304.0, 304.0, 0.06046764748291789, 0.01629792061063021, 0.03560741350800731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 104, 108, 106.0, 108.0, 108.0, 108.0, 0.05973715651135006, 0.01761779420549582, 0.03692736335125448], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1140.6296296296296, 791, 2072, 1076.0, 1493.5, 1618.0, 2072.0, 0.24336492570609627, 291.14905848194365, 0.4805506638454362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1102.478260869565, 474, 2141, 1062.0, 1646.4, 2046.3999999999987, 2141.0, 0.0986476691271397, 0.03122949307965156, 0.04450705384447123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 101.66666666666667, 99, 103, 103.0, 103.0, 103.0, 103.0, 0.12445550715619165, 0.03354464841319228, 0.07328776446795271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 99.66666666666667, 99, 100, 100.0, 100.0, 100.0, 100.0, 0.12447616281482098, 0.033550215758682216, 0.07317836915480685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 197.5263157894737, 100, 1112, 102.0, 306.0, 1112.0, 1112.0, 0.09938434016644261, 4.732019648349436, 0.05797760386971236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 158.3157894736842, 98, 597, 103.0, 297.0, 597.0, 597.0, 0.0993833004671015, 1.5633765509025572, 0.05807405134716679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 136.94736842105263, 99, 347, 103.0, 304.0, 347.0, 347.0, 0.09938382031405286, 0.07385848365136156, 0.049886019181077323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 102.33333333333333, 102, 103, 102.0, 103.0, 103.0, 103.0, 0.12446067042814471, 0.03330295282940591, 0.07098147610355128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 144.05263157894737, 98, 307, 102.0, 306.0, 307.0, 307.0, 0.09938434016644261, 0.034449423832364774, 0.05624082983308662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 101.33333333333333, 101, 102, 101.0, 102.0, 102.0, 102.0, 0.12445550715619165, 0.09249086029869322, 0.06247083074051027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 104.66666666666667, 104, 106, 104.0, 106.0, 106.0, 106.0, 0.09652820232311207, 0.07597825300041829, 0.034312759419543745], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 652.0714285714287, 103, 2795, 564.0, 1759.5, 2795.0, 2795.0, 0.11533645290977394, 0.02226920351940948, 0.07848928812693601], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1270.391304347826, 830, 2114, 1224.0, 1677.0000000000002, 2036.199999999999, 2114.0, 0.1004217714400482, 0.0519761121711187, 0.0461900921369753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 204.66666666666666, 204, 206, 204.0, 206.0, 206.0, 206.0, 0.12392597488433577, 0.19206105677875085, 0.2787124220299075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e39ccc0-bec0-474d-bd8f-86004626866b", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f263e85c-0f26-4ce0-9abf-64b481f3d9b4", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 1057.736842105263, 519, 2303, 838.0, 1847.8, 1935.8999999999994, 2303.0, 0.2740292394005971, 87.31492322073295, 0.9966095266625642], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bbc56bdb-d575-43b0-8cf4-74ce05e8dcf2", 3, 0, 0.0, 900.3333333333334, 183, 2012, 506.0, 2012.0, 2012.0, 2012.0, 0.031185355357124293, 0.02599794761380056, 0.019998421241385046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed67e396-62ce-43f4-ac98-af7f0ba4b0e1", 3, 0, 0.0, 305.3333333333333, 229, 403, 284.0, 403.0, 403.0, 403.0, 0.022545033704825388, 0.02664746659577506, 0.01445758997347201], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 180.12962962962965, 101, 417, 104.0, 410.5, 415.25, 417.0, 0.24433946896888742, 0.1815843123880111, 0.11811331751913993], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 639.2592592592594, 492, 927, 601.0, 808.0, 818.0, 927.0, 0.24418920141087097, 71.79973305937416, 0.12280999875644388], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 170.7407407407407, 97, 431, 104.5, 306.0, 339.0, 431.0, 0.244730366053179, 0.4330580305550394, 0.11901926005320619], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 958.6851851851853, 686, 1667, 959.5, 1157.5, 1214.25, 1667.0, 0.2438627865387742, 219.42816399264348, 0.12240768777434563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 118.83333333333331, 102, 303, 106.0, 141.90000000000026, 303.0, 303.0, 0.12124968003556658, 0.09058203635469572, 0.043100472200142806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 5, 2.9761904761904763, 168.82738095238082, 101, 1865, 108.5, 304.0, 340.49999999999983, 984.5600000000029, 0.7308796658835812, 1.5573550544353083, 0.3520825176194205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 122.53846153846153, 103, 308, 107.0, 231.59999999999994, 308.0, 308.0, 0.06070142835130252, 0.047008039729084856, 0.021577460859252065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 107.64285714285712, 100, 132, 105.5, 123.0, 132.0, 132.0, 0.0725136869584134, 0.05884655650629056, 0.025776349660998513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00de8e38-8576-42a5-9464-946315f836e3", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09271c9f-5f0e-4ac1-963c-c1d8f00ffab4", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18bf9201-5d07-4d23-9d15-c69ae66d1b2f", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 302.46153846153845, 203, 614, 210.0, 610.8, 614.0, 614.0, 0.06043812995127757, 0.09366729710222413, 0.13592677077909399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e39ccc0-bec0-474d-bd8f-86004626866b", 3, 0, 0.0, 709.0, 309, 1198, 620.0, 1198.0, 1198.0, 1198.0, 0.029605360543949157, 0.024680770948259698, 0.01898520842173823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 367.26315789473693, 202, 1415, 208.0, 648.0, 1415.0, 1415.0, 0.09933030463036056, 6.400239127906064, 0.22205857318552286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/435b74fd-042b-462e-9b83-5c5289375bd2", 3, 0, 0.0, 839.0, 320, 1618, 579.0, 1618.0, 1618.0, 1618.0, 0.015970614070110994, 0.022016780790013044, 0.010241572173866752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8acf9599-b150-4dce-89b1-0eeaecca3d4a", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 109.28571428571429, 103, 152, 105.5, 132.5, 152.0, 152.0, 0.08355315771255327, 0.06927405361128684, 0.029700536530634168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d521c04-704d-4c24-8a89-a3bc5c2e2747", 3, 0, 0.0, 320.6666666666667, 189, 539, 234.0, 539.0, 539.0, 539.0, 0.017596959245442387, 0.024258828907698083, 0.011284508370286947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e64621cd-7104-4072-9ff9-ff4fc80b6411", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 104.53846153846155, 102, 115, 103.0, 111.8, 115.0, 115.0, 0.06829811602273803, 0.0530244162481218, 0.024277845929957652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d626a8c4-e36a-4462-936c-381ea007e94f", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0a3649d-bc9d-4e34-9f99-4e20a6b2f442", 3, 0, 0.0, 258.3333333333333, 187, 396, 192.0, 396.0, 396.0, 396.0, 0.027474288644876502, 0.0324736790590972, 0.01761860306979385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 113.61111111111113, 99, 310, 103.0, 124.60000000000029, 310.0, 310.0, 0.12919062076093277, 0.09600982656159163, 0.06484763581164008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 159.5, 100, 306, 103.0, 305.1, 306.0, 306.0, 0.1291934025235778, 0.05612959892625928, 0.07247503158060951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 228.83333333333337, 98, 1206, 102.0, 910.8000000000004, 1206.0, 1206.0, 0.12919247525605232, 12.947354178479404, 0.07471743631887574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 231.1111111111111, 99, 886, 103.5, 804.1000000000001, 886.0, 886.0, 0.12919154800183738, 4.2516859945596, 0.07484306366990123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.3927729772191673], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15710919088766692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.15710919088766692], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.7069913589945012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 18, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
