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

    var data = {"OkPercent": 97.6401179941003, "KoPercent": 2.359882005899705};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8024142312579415, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/733529ed-06de-4eff-b717-554fc4613233"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11a24084-ad52-44bf-9597-5248c578c5e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b98cf1a7-ba75-4c77-94e0-8cc6c2458d46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db02e8c3-be59-45ee-bc06-4e2990c4a95f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3337298-0056-4fdd-a9c0-96c2cba8027f"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca72b96a-5ede-4ff3-a761-e6c6e9c52c64"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=807375f4-ac38-4fab-916b-48f8cdae8e22"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b912f2b-4944-495a-b4d4-6cc9dc63da01"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0f8df74b-30e2-4a40-ac94-818a10e54b50"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=628922f2-b712-4d1f-811a-d2a25e34f809"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fafa53b-ce19-464e-bc11-301c461117f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79121a04-b3b3-471c-b9cb-e908e8831647"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3337298-0056-4fdd-a9c0-96c2cba8027f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b98cf1a7-ba75-4c77-94e0-8cc6c2458d46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11a24084-ad52-44bf-9597-5248c578c5e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=733529ed-06de-4eff-b717-554fc4613233"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb753901-aab2-4e13-8ac4-eb82d38eda72"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/628922f2-b712-4d1f-811a-d2a25e34f809"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3790322580645161, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17a08ea3-060c-4b62-95a3-5cfbec570a08"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4407a8d5-1e64-4a27-9dbc-7b269bf39276"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9175824175824175, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4407a8d5-1e64-4a27-9dbc-7b269bf39276"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b912f2b-4944-495a-b4d4-6cc9dc63da01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca72b96a-5ede-4ff3-a761-e6c6e9c52c64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17a08ea3-060c-4b62-95a3-5cfbec570a08"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/807375f4-ac38-4fab-916b-48f8cdae8e22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f8df74b-30e2-4a40-ac94-818a10e54b50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1356, 32, 2.359882005899705, 304.1084070796461, 77, 2416, 93.0, 844.3, 1019.1499999999999, 1806.190000000002, 5.558789528486746, 768.684999652832, 4.073016408113947], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1335.1896551724137, 959, 1769, 1282.0, 1608.8, 1682.15, 1769.0, 0.24552550925377176, 295.45002024659436, 1.2072470108327547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/733529ed-06de-4eff-b717-554fc4613233", 3, 0, 0.0, 790.0, 186, 1792, 392.0, 1792.0, 1792.0, 1792.0, 0.027003429435538313, 0.02251164804180131, 0.017316652339847163], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 607.8571428571429, 83, 1541, 494.5, 1340.0, 1541.0, 1541.0, 0.08174657394269566, 0.016770136297814448, 0.05472390277120886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 607.8571428571429, 83, 1541, 494.5, 1340.0, 1541.0, 1541.0, 0.08048289738430583, 0.01651089573153205, 0.05387795523138833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.2, 79, 239, 81.0, 237.2, 239.0, 239.0, 0.09196417075907226, 0.024607600378892383, 0.0524483161360334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11a24084-ad52-44bf-9597-5248c578c5e1", 3, 0, 0.0, 319.6666666666667, 190, 438, 331.0, 438.0, 438.0, 438.0, 0.09051412020275162, 0.04007135529809317, 0.05804453671856143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b98cf1a7-ba75-4c77-94e0-8cc6c2458d46", 3, 0, 0.0, 334.6666666666667, 205, 472, 327.0, 472.0, 472.0, 472.0, 0.030214827422977368, 0.03030334742519312, 0.019376044929448378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 91.66666666666667, 79, 234, 81.0, 145.20000000000005, 234.0, 234.0, 0.09204769297798833, 0.06840653745727453, 0.0462036271393418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 113.13333333333333, 77, 241, 80.0, 240.4, 241.0, 241.0, 0.09205221201465472, 0.024810947769574904, 0.05420652719222343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 133.86666666666667, 78, 239, 81.0, 238.4, 239.0, 239.0, 0.09205164711080563, 0.02481079551033433, 0.05411630035225097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db02e8c3-be59-45ee-bc06-4e2990c4a95f", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3337298-0056-4fdd-a9c0-96c2cba8027f", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 238.21428571428572, 79, 481, 204.5, 475.0, 481.0, 481.0, 0.08127155147391764, 0.15276965465395734, 0.05252378099929177], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 90.0, 78, 234, 81.0, 116.39999999999989, 234.0, 234.0, 0.09168720639868834, 0.06813863678652521, 0.0460226797743416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 98.52941176470586, 77, 238, 80.0, 237.2, 238.0, 238.0, 0.09168770090393287, 0.02453362309343516, 0.05229064192177421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 569.3333333333334, 462, 631, 616.0, 631.0, 631.0, 631.0, 0.04852719949531713, 14.268607906293978, 0.02767566846217305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 766.5, 544, 1002, 744.5, 1002.0, 1002.0, 1002.0, 0.048499349300396885, 43.63979975325956, 0.027612422502081433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 146.66666666666666, 79, 321, 80.5, 321.0, 321.0, 321.0, 0.048681936567436655, 0.0861442080665969, 0.02695572073607088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 90.75, 78, 236, 81.0, 131.7000000000001, 236.0, 236.0, 0.08612105390639718, 0.06400207228785962, 0.04322873213660952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 109.1875, 77, 239, 80.5, 236.2, 239.0, 239.0, 0.08605111436193098, 0.023025395835126063, 0.049076026159538766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 99.0625, 78, 237, 80.0, 234.9, 237.0, 237.0, 0.08612290815530113, 0.023212815088733508, 0.05063085030223758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 119.25000000000001, 78, 238, 80.0, 237.3, 238.0, 238.0, 0.08605018877260162, 0.02319321494261528, 0.050672132646366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 179.0, 82, 328, 167.5, 328.0, 328.0, 328.0, 0.04858417613383321, 0.03610601370883503, 0.027281153590775483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 480.78947368421063, 79, 942, 706.0, 940.0, 942.0, 942.0, 0.08380713772159269, 39.70007348287026, 0.04547881168095064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 117.41176470588236, 78, 242, 80.0, 238.8, 242.0, 242.0, 0.09168868993042448, 0.02471296720780972, 0.05390292122862845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 363.7368421052632, 78, 702, 461.0, 633.0, 702.0, 702.0, 0.0837495096245818, 12.971290723199056, 0.045529325827467194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 102.94117647058823, 77, 307, 80.0, 250.99999999999994, 307.0, 307.0, 0.09168868993042448, 0.02471296720780972, 0.053992460964888626], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 438.2142857142856, 80, 1196, 478.0, 877.0, 1196.0, 1196.0, 0.08063958712531391, 0.016543040299633667, 0.054365346649425154], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 220.9375, 160, 474, 163.0, 366.2000000000001, 474.0, 474.0, 0.08601179436730262, 0.1333014820907317, 0.19344254143349407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 697.904761904762, 123, 1720, 586.0, 1527.0, 1704.0999999999997, 1720.0, 0.09831184517288839, 0.060388818958737114, 0.044451547182663406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 83.73684210526316, 79, 129, 81.0, 88.0, 129.0, 129.0, 0.08380676805815308, 0.06228217821509228, 0.04206706912294012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 143.8947368421053, 78, 323, 82.0, 242.0, 323.0, 323.0, 0.08380713772159269, 0.0886746369827666, 0.044091789767589575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca72b96a-5ede-4ff3-a761-e6c6e9c52c64", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["login", 21, 0, 0.0, 3172.3809523809523, 1877, 4540, 3158.0, 4392.8, 4528.0, 4540.0, 0.10267743638888345, 35.23618025879603, 0.20356432038538264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 93.6470588235294, 82, 248, 83.0, 123.99999999999989, 248.0, 248.0, 0.0904895484571532, 0.07325765202244142, 0.03216620667812868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=807375f4-ac38-4fab-916b-48f8cdae8e22", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b912f2b-4944-495a-b4d4-6cc9dc63da01", 3, 0, 0.0, 483.0, 237, 747, 465.0, 747.0, 747.0, 747.0, 0.030640696973720495, 0.025543888329979877, 0.01964914486921529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f8df74b-30e2-4a40-ac94-818a10e54b50", 3, 0, 0.0, 1361.3333333333333, 325, 2027, 1732.0, 2027.0, 2027.0, 2027.0, 0.025879693929486462, 0.030588922089181424, 0.01659602768264594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=628922f2-b712-4d1f-811a-d2a25e34f809", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 574.0, 161, 1028, 788.0, 1022.0, 1028.0, 1028.0, 0.08371961859104288, 52.77607559743862, 0.17701346371195162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fafa53b-ce19-464e-bc11-301c461117f4", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79121a04-b3b3-471c-b9cb-e908e8831647", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 258.8, 161, 472, 314.0, 383.20000000000005, 472.0, 472.0, 0.0919157071688124, 0.14245139382510277, 0.20672057969704583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 552.2727272727273, 79, 1240, 642.0, 1212.6000000000001, 1240.0, 1240.0, 0.07466485660953674, 48.73187733327677, 0.11420461776684203], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1122.818181818182, 158, 2144, 937.0, 1953.8999999999999, 2122.0999999999995, 2144.0, 0.09396328598153195, 0.029413578335483102, 0.042393591917448986], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3337298-0056-4fdd-a9c0-96c2cba8027f", 3, 0, 0.0, 389.0, 169, 601, 397.0, 601.0, 601.0, 601.0, 0.054967202902268315, 0.035338615147128875, 0.035249150298655135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b98cf1a7-ba75-4c77-94e0-8cc6c2458d46", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 240.8823529411765, 159, 478, 169.0, 408.3999999999999, 478.0, 478.0, 0.09164766325413898, 0.14203597810968607, 0.20611774265066607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 84.31250000000001, 80, 102, 82.5, 94.30000000000001, 102.0, 102.0, 0.15323468850260977, 0.11896638414020973, 0.05447014317866206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 295.8235294117647, 161, 936, 317.0, 505.5999999999996, 936.0, 936.0, 0.11067420119267726, 7.94995267864118, 0.247243164647405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 82.1, 79, 86, 82.0, 86.0, 86.0, 86.0, 0.06916011950868652, 0.051397315377060965, 0.034715138112758656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 96.2, 78, 235, 80.0, 220.10000000000005, 235.0, 235.0, 0.06916203281046837, 0.018506247060613608, 0.03944397183722024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 111.7, 78, 236, 82.0, 235.9, 236.0, 236.0, 0.0690870150955128, 0.018621109537462432, 0.04061560848388545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 143.20000000000002, 78, 236, 87.0, 235.9, 236.0, 236.0, 0.06908796971183408, 0.018621366836392778, 0.04068363841429292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.0, 80, 95, 83.0, 95.0, 95.0, 95.0, 0.029257160690078898, 0.008628576687894362, 0.018085725309394476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11a24084-ad52-44bf-9597-5248c578c5e1", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 925.9310344827587, 621, 1382, 866.0, 1260.4, 1337.8, 1382.0, 0.2550515599920846, 305.1303360194367, 0.5036272014687452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1122.818181818182, 158, 2144, 937.0, 1953.8999999999999, 2122.0999999999995, 2144.0, 0.0979759068338195, 0.03066965975639627, 0.04420397359103966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=733529ed-06de-4eff-b717-554fc4613233", 1, 0, 0.0, 1196.0, 1196, 1196, 1196.0, 1196.0, 1196.0, 1196.0, 0.8361204013377926, 0.15105690844481606, 0.5764658235785953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 95.89999999999999, 78, 238, 80.0, 222.70000000000005, 238.0, 238.0, 0.05522360035784893, 0.01488448603395147, 0.032519366226350495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 95.50000000000001, 78, 234, 80.5, 218.80000000000007, 234.0, 234.0, 0.05517637127076701, 0.01487175631907392, 0.03243767139160326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb753901-aab2-4e13-8ac4-eb82d38eda72", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 220.0, 78, 858, 80.0, 797.1, 858.0, 858.0, 0.16406049730838246, 27.715039012432708, 0.09380607536529094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/628922f2-b712-4d1f-811a-d2a25e34f809", 3, 0, 0.0, 348.3333333333333, 238, 406, 401.0, 406.0, 406.0, 406.0, 0.020730401133261928, 0.024502632329060567, 0.01329390958090039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 192.37499999999997, 78, 698, 80.5, 596.5000000000001, 698.0, 698.0, 0.16406049730838246, 9.080784574468085, 0.09396629069469366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 112.6, 77, 238, 81.5, 238.0, 238.0, 238.0, 0.0552242102937928, 0.014776790645018776, 0.0314950574331787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 83.125, 78, 105, 81.0, 98.0, 105.0, 105.0, 0.16405881508520803, 0.1219226155076595, 0.08234983491581732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 81.19999999999999, 79, 84, 81.0, 83.9, 84.0, 84.0, 0.055222380526379726, 0.041039288652905244, 0.02771904647515545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 99.25000000000001, 78, 236, 79.0, 234.6, 236.0, 236.0, 0.16406049730838246, 0.09010109587285312, 0.09098228018456805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 104.9, 82, 238, 87.0, 226.20000000000005, 238.0, 238.0, 0.05585032113934655, 0.04396031136554035, 0.019853043842502093], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 584.0769230769231, 79, 1732, 438.0, 1509.1999999999998, 1732.0, 1732.0, 0.07633274028665879, 0.01481125812503303, 0.05194548484501518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1716.9047619047617, 1130, 2416, 1627.0, 2340.2000000000003, 2410.2999999999997, 2416.0, 0.0990916597853014, 0.0512876754748142, 0.04557829273327828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 211.0, 159, 320, 166.0, 319.8, 320.0, 320.0, 0.05515080988964323, 0.08547298368639043, 0.12403546403891441], "isController": false}, {"data": ["addBook", 62, 14, 22.580645161290324, 813.4677419354841, 405, 1502, 726.0, 1377.6000000000001, 1461.6499999999996, 1502.0, 0.28786999419616943, 78.88753718078932, 1.048198998839234], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/17a08ea3-060c-4b62-95a3-5cfbec570a08", 3, 0, 0.0, 625.3333333333333, 232, 1175, 469.0, 1175.0, 1175.0, 1175.0, 0.03292903792327534, 0.027451584023928433, 0.021116603095329565], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 145.6551724137931, 78, 635, 83.0, 320.1, 326.29999999999995, 635.0, 0.2556597785457366, 0.18999715964189998, 0.12358553748060512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4407a8d5-1e64-4a27-9dbc-7b269bf39276", 3, 0, 0.0, 1217.6666666666667, 228, 2347, 1078.0, 2347.0, 2347.0, 2347.0, 0.024296219508244517, 0.024367399838835076, 0.01558058347371149], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 505.29310344827576, 386, 719, 468.5, 630.3, 663.9499999999999, 719.0, 0.2559813574956197, 75.26701848472277, 0.12874062413109777], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 119.48275862068965, 77, 324, 82.0, 239.0, 245.7499999999999, 324.0, 0.25632866638382124, 0.4535815854369962, 0.12465983970619432], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 778.9482758620692, 541, 1020, 778.5, 939.0, 1018.05, 1020.0, 0.2558063634038124, 230.17501545037356, 0.12840280350542926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 94.88235294117646, 82, 240, 85.0, 122.39999999999989, 240.0, 240.0, 0.10828094446461442, 0.08089347901897465, 0.03849049197765591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 14, 7.6923076923076925, 140.75824175824178, 80, 514, 88.5, 272.0, 353.7, 509.0199999999999, 0.7764770128673333, 1.6552216079260385, 0.37312293614969794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 104.8, 80, 239, 86.5, 226.40000000000003, 239.0, 239.0, 0.0686747153433049, 0.05318266530003983, 0.024411715219690412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4407a8d5-1e64-4a27-9dbc-7b269bf39276", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.33333333333334, 82, 111, 85.0, 103.80000000000001, 111.0, 111.0, 0.09806228916607829, 0.07957984599317487, 0.03485807935200439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b912f2b-4944-495a-b4d4-6cc9dc63da01", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca72b96a-5ede-4ff3-a761-e6c6e9c52c64", 3, 0, 0.0, 266.3333333333333, 172, 423, 204.0, 423.0, 423.0, 423.0, 0.027926200361178856, 0.028008015401299498, 0.017908403226407014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17a08ea3-060c-4b62-95a3-5cfbec570a08", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/807375f4-ac38-4fab-916b-48f8cdae8e22", 3, 0, 0.0, 489.0, 456, 530, 481.0, 530.0, 530.0, 530.0, 0.0176522506619594, 0.024335052588996764, 0.01131996543100912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 226.4, 162, 322, 171.5, 321.3, 322.0, 322.0, 0.06904789852720833, 0.1070107567994918, 0.15529034209781326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 336.25000000000006, 157, 964, 167.5, 896.1, 964.0, 964.0, 0.16392434891297666, 36.977136955591874, 0.3608056561584329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 98.1875, 81, 284, 84.0, 154.5000000000001, 284.0, 284.0, 0.0927380324467191, 0.07688924760475051, 0.03296547247129468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f8df74b-30e2-4a40-ac94-818a10e54b50", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 95.05263157894737, 80, 241, 84.0, 103.0, 241.0, 241.0, 0.08704017591277657, 0.0675751365729076, 0.0309400625314948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 81.23529411764707, 80, 87, 81.0, 83.0, 87.0, 87.0, 0.11073475768629494, 0.08229409238210005, 0.055583657666753515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 116.94117647058825, 79, 239, 81.0, 237.4, 239.0, 239.0, 0.11073331509490496, 0.03941312157215253, 0.06260554269094984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 180.94117647058823, 79, 854, 81.0, 362.79999999999956, 854.0, 854.0, 0.1107340363859016, 5.889189477742459, 0.0645397250213326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 167.35294117647058, 78, 547, 84.0, 362.99999999999983, 547.0, 547.0, 0.11073259381330486, 1.9433290329462036, 0.0646470215374895], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5162241887905604], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22123893805309736], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.14749262536873156], "isController": false}, {"data": ["401/Unauthorized", 20, 62.5, 1.4749262536873156], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1356, 32, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
