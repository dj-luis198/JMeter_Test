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

    var data = {"OkPercent": 98.68012422360249, "KoPercent": 1.3198757763975155};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7728802153432033, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06896551724137931, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6e3131d-c57e-4254-bb60-042c7a85fff6"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb6be5a4-253c-4e7b-b039-988a2521b356"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebd84ddb-fa6a-45fa-8e60-b816eafbcb97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa8b6d4b-9a65-4a44-ac8a-b0b4b16b4fe7"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91aed48b-22f3-471a-9474-d423864c228c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70fa488d-9725-4c08-84d7-c0f62b339b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9f0086a-acee-4545-b4c7-ee89de2da248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6812c34f-aaf6-4b5f-94b4-bd816245fc63"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16ffe6b9-b9cd-4007-9297-c56e07f4de05"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd39ac73-1998-482d-a247-1a0c4dbb3d73"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9ea0ff-9d28-4da1-930b-f030dd255aed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d5184b50-33b2-40ad-82ca-3cced01bb39b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0f29f6a0-68d4-4635-acee-801c3b181121"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d73958a4-96d5-43d9-b541-606e24d75bce"], "isController": false}, {"data": [0.275, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16ffe6b9-b9cd-4007-9297-c56e07f4de05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9ea0ff-9d28-4da1-930b-f030dd255aed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb6be5a4-253c-4e7b-b039-988a2521b356"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70fa488d-9725-4c08-84d7-c0f62b339b6e"], "isController": false}, {"data": [0.5086206896551724, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9205882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91aed48b-22f3-471a-9474-d423864c228c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6812c34f-aaf6-4b5f-94b4-bd816245fc63"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa8b6d4b-9a65-4a44-ac8a-b0b4b16b4fe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1aa1da88-ce85-4ede-9a26-bfc47a9a6532"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd39ac73-1998-482d-a247-1a0c4dbb3d73"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f29f6a0-68d4-4635-acee-801c3b181121"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d73958a4-96d5-43d9-b541-606e24d75bce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 17, 1.3198757763975155, 408.85714285714283, 100, 5588, 207.0, 1065.4000000000005, 1244.0, 2180.819999999984, 5.083795795606148, 730.5043389449643, 3.728185784514947], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1831.3620689655172, 1227, 2498, 1846.5, 2277.0, 2309.0499999999997, 2498.0, 0.2577434119895125, 310.15163689980227, 1.2673223431320269], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c6e3131d-c57e-4254-bb60-042c7a85fff6", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 682.0, 113, 1254, 521.0, 1237.4, 1254.0, 1254.0, 0.05991840203068912, 0.011447478797056373, 0.040465135320263856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 682.0, 113, 1254, 521.0, 1237.4, 1254.0, 1254.0, 0.060301397347834906, 0.011520650487619027, 0.04072378636585406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb6be5a4-253c-4e7b-b039-988a2521b356", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 155.0, 101, 308, 105.0, 305.8, 307.9, 308.0, 0.10223433131079748, 0.05806590536167951, 0.05658829979195314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebd84ddb-fa6a-45fa-8e60-b816eafbcb97", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 116.89999999999999, 101, 210, 104.0, 197.50000000000014, 209.7, 210.0, 0.10226412778925408, 0.07599902465588121, 0.051331798519215426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 269.40000000000003, 101, 930, 105.0, 853.3000000000002, 926.4499999999999, 930.0, 0.10222962819084226, 6.033824269824881, 0.058442601897381895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 324.84999999999997, 100, 1244, 104.0, 1111.7, 1237.4499999999998, 1244.0, 0.10223276355606445, 18.41988801039707, 0.05834455763883209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa8b6d4b-9a65-4a44-ac8a-b0b4b16b4fe7", 3, 0, 0.0, 283.6666666666667, 183, 436, 232.0, 436.0, 436.0, 436.0, 0.04175249123197684, 0.02684282883566219, 0.026774872306964313], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 265.6363636363636, 101, 457, 209.0, 456.8, 457.0, 457.0, 0.05998702099000398, 0.12404808948154854, 0.03877534622054501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91aed48b-22f3-471a-9474-d423864c228c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 147.49999999999997, 101, 321, 104.0, 313.0, 321.0, 321.0, 0.08682762855140505, 0.06452717317150317, 0.043583399487716994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 746.0, 611, 852, 799.0, 852.0, 852.0, 852.0, 0.027026880935778725, 7.946800372025016, 0.015413768033686303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 140.35714285714283, 100, 317, 103.0, 308.0, 317.0, 317.0, 0.08676466942660949, 0.032524646588908995, 0.04896248435137212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1089.4, 916, 1208, 1112.0, 1208.0, 1208.0, 1208.0, 0.026961590518147848, 24.260086541650264, 0.015350202414140814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 194.8, 105, 364, 161.0, 364.0, 364.0, 364.0, 0.027100564775769928, 0.04795529626337413, 0.015005879128771044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70fa488d-9725-4c08-84d7-c0f62b339b6e", 3, 0, 0.0, 840.3333333333334, 333, 1313, 875.0, 1313.0, 1313.0, 1313.0, 0.019654603108047904, 0.023231075483503238, 0.012604026081658325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 133.1818181818182, 102, 250, 104.0, 235.40000000000003, 250.0, 250.0, 0.05472446233215758, 0.040669253744894454, 0.027469114881571288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 190.36363636363637, 100, 353, 159.0, 341.00000000000006, 353.0, 353.0, 0.05471384658237419, 0.014640228480049342, 0.03120399062901028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 214.6363636363636, 102, 352, 228.0, 343.6, 352.0, 352.0, 0.05471112525863441, 0.014746357979866304, 0.03216415762275187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 190.81818181818184, 100, 314, 176.0, 312.0, 314.0, 314.0, 0.054713030156827436, 0.014746871409457395, 0.032218708188053655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9f0086a-acee-4545-b4c7-ee89de2da248", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 151.2, 101, 307, 113.0, 307.0, 307.0, 307.0, 0.027105119072788085, 0.020143550404679425, 0.015220159635598779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6812c34f-aaf6-4b5f-94b4-bd816245fc63", 3, 0, 0.0, 365.3333333333333, 185, 494, 417.0, 494.0, 494.0, 494.0, 0.02938410907381288, 0.0244963227011832, 0.018843325154756306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 779.4285714285714, 104, 1225, 981.0, 1221.0, 1225.0, 1225.0, 0.07388564612997542, 42.74582005975502, 0.03935482657983344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 241.28571428571428, 100, 1098, 103.5, 708.0, 1098.0, 1098.0, 0.08676520715193208, 5.598250218849741, 0.05047585293297388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 591.1428571428571, 101, 910, 708.5, 886.0, 910.0, 910.0, 0.07388213688249046, 13.972412855359885, 0.0394251079206928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 198.92857142857142, 101, 925, 104.0, 617.5, 925.0, 925.0, 0.08676789587852494, 1.844047780446235, 0.05056215137898978], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 780.5454545454545, 104, 2325, 530.0, 2115.2000000000007, 2325.0, 2325.0, 0.06003482019571351, 0.011469720619777652, 0.041002119297374295], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 352.4545454545455, 210, 549, 393.0, 530.6, 549.0, 549.0, 0.05468256769453324, 0.08474729973752368, 0.12298237636768558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16ffe6b9-b9cd-4007-9297-c56e07f4de05", 3, 0, 0.0, 926.6666666666667, 209, 2163, 408.0, 2163.0, 2163.0, 2163.0, 0.04552352048558422, 0.02926723729135053, 0.029193143019726857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd39ac73-1998-482d-a247-1a0c4dbb3d73", 3, 0, 0.0, 545.3333333333334, 240, 994, 402.0, 994.0, 994.0, 994.0, 0.06577649148194435, 0.029762149466114142, 0.04218088809226249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 909.15, 134, 3226, 615.5, 2463.2000000000016, 3191.6999999999994, 3226.0, 0.09325183123283584, 0.057280665864700916, 0.04216366978594042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 136.64285714285714, 102, 332, 107.0, 294.0, 332.0, 332.0, 0.0739297350675137, 0.05494192225232219, 0.037109261547560585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 233.64285714285714, 101, 332, 283.5, 323.5, 332.0, 332.0, 0.07388018744458985, 0.09110309386477815, 0.0381460063800819], "isController": false}, {"data": ["login", 20, 0, 0.0, 3566.9499999999994, 1599, 8197, 2723.5, 7011.300000000003, 8143.849999999999, 8197.0, 0.08917146334829928, 26.792302001732153, 0.17150702838327678], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2c9ea0ff-9d28-4da1-930b-f030dd255aed", 3, 0, 0.0, 548.3333333333333, 208, 1069, 368.0, 1069.0, 1069.0, 1069.0, 0.023880977209587418, 0.028226506591149707, 0.015314298536096097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5184b50-33b2-40ad-82ca-3cced01bb39b", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 122.5, 103, 251, 106.0, 223.0, 251.0, 251.0, 0.08403714441783268, 0.06803397726795243, 0.029872578679776465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f29f6a0-68d4-4635-acee-801c3b181121", 3, 0, 0.0, 2337.6666666666665, 457, 4204, 2352.0, 4204.0, 4204.0, 4204.0, 0.015784239962538738, 0.021759849036898295, 0.010122054923893656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 934.8571428571429, 213, 1334, 1083.5, 1330.5, 1334.0, 1334.0, 0.07383771525012525, 56.8280263162232, 0.1539178489491311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 473.9, 204, 1455, 322.5, 1215.8, 1443.0499999999997, 1455.0, 0.10217531240101767, 24.57412052599851, 0.22456617000950232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 916.5714285714286, 101, 1468, 1152.0, 1468.0, 1468.0, 1468.0, 0.037719581851492615, 32.23555036911305, 0.0678931424453066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d73958a4-96d5-43d9-b541-606e24d75bce", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 0.14158625587774296, 0.5403237656739812], "isController": false}, {"data": ["register", 20, 5, 25.0, 1258.9, 230, 4027, 1096.5, 1987.9000000000005, 3926.0499999999984, 4027.0, 0.08971667474116739, 0.028299302677145574, 0.04047764036173763], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16ffe6b9-b9cd-4007-9297-c56e07f4de05", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 144.76470588235293, 104, 360, 112.0, 287.99999999999994, 360.0, 360.0, 0.10183543393875497, 0.07906168943487324, 0.03619931440791681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 404.7857142857143, 204, 1200, 309.0, 911.5, 1200.0, 1200.0, 0.08670931939377799, 7.534390261227308, 0.19342662069008232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 345.99999999999994, 207, 662, 335.0, 545.0, 662.0, 662.0, 0.10022788656313301, 0.1553336484137618, 0.22541486597157748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 133.3, 102, 304, 105.0, 289.30000000000007, 304.0, 304.0, 0.046086559776572354, 0.034249874990206604, 0.023133292700349795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 179.6, 101, 331, 106.0, 331.0, 331.0, 331.0, 0.046038607976649215, 0.012318924400001841, 0.026256393611682756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 139.2, 102, 305, 103.5, 295.0, 305.0, 305.0, 0.046078702423739744, 0.012419650262648603, 0.027089237167081375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 140.0, 102, 339, 104.0, 326.30000000000007, 339.0, 339.0, 0.0460369123963594, 0.012408386544331244, 0.027109627124028046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1218.7586206896553, 806, 1793, 1152.5, 1626.7, 1712.3, 1793.0, 0.2555437574625386, 305.7191753096265, 0.504599099208255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1258.9, 230, 4027, 1096.5, 1987.9000000000005, 3926.0499999999984, 4027.0, 0.09081909743980963, 0.02864703952447121, 0.040975022477726615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 153.7777777777778, 101, 332, 112.0, 332.0, 332.0, 332.0, 0.04220695476821348, 0.011376093277370037, 0.024854290747297583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 171.44444444444443, 102, 357, 132.0, 357.0, 357.0, 357.0, 0.04220735064460004, 0.011376199978427353, 0.02481330575004807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 154.17647058823528, 101, 335, 104.0, 311.0, 335.0, 335.0, 0.10348249015394542, 0.027891764924305604, 0.060836385813159324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 194.23529411764707, 101, 413, 150.0, 354.59999999999997, 413.0, 413.0, 0.10347934065398944, 0.027890916035645592, 0.06093558829526917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 176.88888888888886, 104, 329, 153.0, 329.0, 329.0, 329.0, 0.04220754858557815, 0.011293816711375403, 0.02407149255271254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 130.76470588235293, 103, 305, 105.0, 198.5999999999999, 305.0, 305.0, 0.10353353877635538, 0.07694240528203754, 0.051968983331100255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 185.88888888888889, 103, 345, 117.0, 345.0, 345.0, 345.0, 0.04220834036805673, 0.03136772169930778, 0.021186608348809723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 166.64705882352942, 101, 339, 108.0, 330.2, 339.0, 339.0, 0.10348060043096627, 0.027689145037192144, 0.05901627993328545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 155.0, 104, 323, 132.0, 323.0, 323.0, 323.0, 0.04255842325770544, 0.033498133931358, 0.01512818951738748], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 942.3636363636364, 108, 4204, 494.0, 3625.800000000002, 4204.0, 4204.0, 0.05896005188484566, 0.011117822283683609, 0.04012675406154357], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1840.5, 889, 5588, 1246.5, 3784.5000000000005, 5499.3499999999985, 5588.0, 0.0922432639356511, 0.047743095591694415, 0.042428298157902014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 381.0, 209, 658, 289.0, 658.0, 658.0, 658.0, 0.04218618168182244, 0.06538034211821506, 0.09487771134105184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9ea0ff-9d28-4da1-930b-f030dd255aed", 1, 0, 0.0, 1017.0, 1017, 1017, 1017.0, 1017.0, 1017.0, 1017.0, 0.9832841691248771, 0.17764411258603738, 0.6779283431661751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb6be5a4-253c-4e7b-b039-988a2521b356", 3, 0, 0.0, 354.3333333333333, 196, 553, 314.0, 553.0, 553.0, 553.0, 0.02711227191801249, 0.027191702402147293, 0.017386450416173375], "isController": false}, {"data": ["addBook", 56, 8, 14.285714285714286, 1222.0892857142853, 535, 2908, 1219.0, 1793.1000000000004, 2005.5999999999995, 2908.0, 0.2600466226444884, 78.77799165354824, 0.9460520075831452], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 206.05172413793105, 102, 421, 125.0, 412.3, 416.1, 421.0, 0.2566769189918793, 0.1907530618679884, 0.12407722158298852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70fa488d-9725-4c08-84d7-c0f62b339b6e", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.18012369142572285, 0.6873909521435694], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 683.8965517241379, 499, 921, 628.0, 876.1, 914.05, 921.0, 0.2562539211268104, 75.34716124225716, 0.12887770447295638], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 155.93103448275863, 101, 370, 106.0, 317.5, 323.84999999999997, 370.0, 0.25683149639771685, 0.4544713588600224, 0.12490438008404589], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1011.103448275862, 701, 1334, 1011.5, 1255.0, 1300.1, 1334.0, 0.2560615960584174, 230.40467424163825, 0.12853091833401029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 175.8421052631579, 105, 325, 115.0, 316.0, 325.0, 325.0, 0.1022478379963729, 0.07638632428439966, 0.03634591116277318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 214.0882352941175, 102, 1201, 124.0, 433.40000000000003, 648.8, 1159.8199999999995, 0.718916381566984, 1.5907594267910532, 0.3427820398829435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 166.2, 105, 435, 114.5, 416.80000000000007, 435.0, 435.0, 0.04730346592494832, 0.03663246921726955, 0.016814903903008972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91aed48b-22f3-471a-9474-d423864c228c", 3, 0, 0.0, 342.3333333333333, 194, 440, 393.0, 440.0, 440.0, 440.0, 0.04241241835609467, 0.027267098389741853, 0.027198067760907062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 110.9, 103, 137, 107.0, 128.9, 136.6, 137.0, 0.10296964454878701, 0.08356227990238478, 0.036602490835701634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 315.5, 206, 610, 215.0, 597.1, 610.0, 610.0, 0.046014457742622736, 0.07131342230228738, 0.10348759392701186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6812c34f-aaf6-4b5f-94b4-bd816245fc63", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 350.1764705882353, 207, 609, 348.0, 543.4, 609.0, 609.0, 0.10341261633919338, 0.160269357549121, 0.2325773978800414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa8b6d4b-9a65-4a44-ac8a-b0b4b16b4fe7", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 154.27272727272728, 105, 293, 131.0, 281.00000000000006, 293.0, 293.0, 0.0534910183717334, 0.044349486911720366, 0.019014385436827107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa1da88-ce85-4ede-9a26-bfc47a9a6532", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.4709969579646017, 0.8800585361356932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 133.07142857142858, 105, 346, 107.0, 266.0, 346.0, 346.0, 0.07319496000418257, 0.056826165237622205, 0.02601852093898677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd39ac73-1998-482d-a247-1a0c4dbb3d73", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f29f6a0-68d4-4635-acee-801c3b181121", 1, 0, 0.0, 2325.0, 2325, 2325, 2325.0, 2325.0, 2325.0, 2325.0, 0.43010752688172044, 0.07770497311827956, 0.29653897849462363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d73958a4-96d5-43d9-b541-606e24d75bce", 3, 0, 0.0, 529.3333333333334, 193, 939, 456.0, 939.0, 939.0, 939.0, 0.01890109059292721, 0.02267269493324765, 0.012120816558615431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 121.94736842105263, 101, 196, 105.0, 173.0, 196.0, 196.0, 0.10047487599285042, 0.07466931702203043, 0.05043367798859875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 192.94736842105266, 101, 408, 110.0, 400.0, 408.0, 408.0, 0.10032102728731943, 0.02684371237961477, 0.057214335874799356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 191.6315789473684, 100, 396, 111.0, 380.0, 396.0, 396.0, 0.10032314613386277, 0.027040222981392695, 0.05897903708260291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 169.68421052631578, 100, 466, 104.0, 362.0, 466.0, 466.0, 0.10028607923655902, 0.0270302322942288, 0.059055181425434665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.38819875776397517], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07763975155279502], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07763975155279502], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7763975155279503], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
