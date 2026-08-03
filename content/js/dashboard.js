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

    var data = {"OkPercent": 98.923904688701, "KoPercent": 1.0760953112990008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7774834437086092, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/665a31cc-f133-4496-ac86-cd293de588cc"], "isController": false}, {"data": [0.06896551724137931, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/46c283b0-6457-43b8-b729-fef9748a7e95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e1b094b-626b-4269-982e-d394e8781665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52e49e20-6990-46b9-9d38-1af5bd28974b"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fac3bb95-ea10-48f4-bcc5-5c06f2fb1d79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/919cc5ea-225c-4924-b045-4a7946407ad5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68770128-19cf-461c-91fc-ede94c03ed1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2680948-c365-41f5-967f-795b19cdf649"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/567d6779-5057-4d64-b7dd-a0192b8b4f9d"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4f178b91-f3f6-4759-8816-3f57d90e963c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f93c88d7-c4c4-446c-8b35-7d9fce7285b1"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2f9f234-3ff5-4b3b-96d5-94b4b546cc09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64d39cf3-a431-4054-a4ae-07c005acdfbc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bd0203f-1ac0-4c3e-b1a0-3c19ed280714"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e3c9a00-8f8b-49c6-b1b3-4fd5449aeaf3"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d113de09-c7c5-464b-ad54-f05e56912b88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e1b094b-626b-4269-982e-d394e8781665"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64d39cf3-a431-4054-a4ae-07c005acdfbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bd0203f-1ac0-4c3e-b1a0-3c19ed280714"], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2680948-c365-41f5-967f-795b19cdf649"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46c283b0-6457-43b8-b729-fef9748a7e95"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=919cc5ea-225c-4924-b045-4a7946407ad5"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9511494252873564, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=567d6779-5057-4d64-b7dd-a0192b8b4f9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2f9f234-3ff5-4b3b-96d5-94b4b546cc09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f178b91-f3f6-4759-8816-3f57d90e963c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fac3bb95-ea10-48f4-bcc5-5c06f2fb1d79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ff382c8-7ef1-474d-9879-603ba51aec3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8255bc0-bfaf-4fca-af95-b3c721d87415"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3c9a00-8f8b-49c6-b1b3-4fd5449aeaf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 14, 1.0760953112990008, 392.67255956956194, 100, 2647, 126.0, 1105.5999999999997, 1349.4999999999993, 1810.9, 5.084772260046431, 695.3299044015915, 3.7159046246120955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/665a31cc-f133-4496-ac86-cd293de588cc", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.7080619456762749, 1.3230148281596452], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1830.9827586206895, 1305, 2382, 1813.5, 2213.3, 2293.4, 2382.0, 0.2698477686381062, 324.71817646444754, 1.3268393702078758], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/46c283b0-6457-43b8-b729-fef9748a7e95", 3, 0, 0.0, 686.0, 241, 1222, 595.0, 1222.0, 1222.0, 1222.0, 0.029065261199813983, 0.029150413332235316, 0.01863885565222446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e1b094b-626b-4269-982e-d394e8781665", 3, 0, 0.0, 318.3333333333333, 226, 496, 233.0, 496.0, 496.0, 496.0, 0.017005356687356518, 0.0234432570217952, 0.010905127823597767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52e49e20-6990-46b9-9d38-1af5bd28974b", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 526.6153846153846, 119, 1077, 516.0, 937.7999999999998, 1077.0, 1077.0, 0.07224550132820576, 0.014322106220337664, 0.04857250878060708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 526.6153846153846, 119, 1077, 516.0, 937.7999999999998, 1077.0, 1077.0, 0.0726139340553765, 0.014395145130118584, 0.048820215579598834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 156.46666666666667, 103, 341, 113.0, 339.2, 341.0, 341.0, 0.07707406303630703, 0.02062333327338684, 0.04395630157539385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 115.06666666666666, 108, 143, 113.0, 129.8, 143.0, 143.0, 0.0770732709896208, 0.05727808517880999, 0.038687169227212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 166.26666666666665, 106, 335, 110.0, 328.4, 335.0, 335.0, 0.07707406303630703, 0.020773868552754628, 0.04538638672938783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 142.20000000000002, 107, 340, 114.0, 328.0, 340.0, 340.0, 0.07707247895921324, 0.020773441594475445, 0.04531018782563122], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 308.9230769230769, 115, 1041, 233.0, 780.5999999999998, 1041.0, 1041.0, 0.0723343404499196, 0.16921301802516123, 0.046752153337673394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fac3bb95-ea10-48f4-bcc5-5c06f2fb1d79", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 112.72222222222223, 107, 117, 113.0, 117.0, 117.0, 117.0, 0.10724946822138674, 0.07970395050437042, 0.05383420572831327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 844.5, 664, 1025, 844.5, 1025.0, 1025.0, 1025.0, 0.01778441729356738, 5.229209182539259, 0.010142675487737644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 135.27777777777777, 100, 341, 114.0, 323.0, 341.0, 341.0, 0.10725330250793973, 0.04659746345939569, 0.06016705446680212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1233.0, 1192, 1274, 1233.0, 1274.0, 1274.0, 1274.0, 0.01770130812667056, 15.927668167958862, 0.010077990857274352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/919cc5ea-225c-4924-b045-4a7946407ad5", 3, 0, 0.0, 371.0, 209, 526, 378.0, 526.0, 526.0, 526.0, 0.023932223941796834, 0.028707762117682722, 0.015347161837675703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68770128-19cf-461c-91fc-ede94c03ed1b", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.6779956210191083, 1.266835854564756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 302.0, 121, 483, 302.0, 483.0, 483.0, 483.0, 0.017813087275221105, 0.03152081459248109, 0.009863301254931999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 140.29411764705878, 107, 339, 115.0, 335.8, 339.0, 339.0, 0.0844028498374004, 0.06272516477173994, 0.04236627423478887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2680948-c365-41f5-967f-795b19cdf649", 3, 0, 0.0, 429.3333333333333, 269, 629, 390.0, 629.0, 629.0, 629.0, 0.025410808063696427, 0.025485253790445535, 0.01629534241063866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 183.76470588235293, 105, 459, 115.0, 364.5999999999999, 459.0, 459.0, 0.08440662145119808, 0.03004270602663277, 0.0477211608641252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 203.23529411764707, 108, 967, 115.0, 466.99999999999955, 967.0, 967.0, 0.0843090870317746, 4.483826332269551, 0.049138327034948595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 183.35294117647058, 105, 864, 114.0, 445.5999999999996, 864.0, 864.0, 0.08440787873070411, 1.4813369370118619, 0.04927833591108375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 112.5, 111, 114, 112.5, 114.0, 114.0, 114.0, 0.017871503887052095, 0.013281459431686177, 0.010035268295952105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 738.5, 106, 1394, 1005.0, 1357.6000000000001, 1394.0, 1394.0, 0.08631199628858416, 43.696001268044604, 0.046569705028752684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 224.16666666666669, 107, 1236, 115.0, 1011.9000000000003, 1236.0, 1236.0, 0.10725010725010725, 10.748343674775967, 0.062027243016826356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 561.6250000000001, 107, 1081, 755.0, 1013.1, 1081.0, 1081.0, 0.086313393141322, 14.285867513661792, 0.046654749124728244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 222.94444444444446, 107, 919, 113.0, 882.1, 919.0, 919.0, 0.10725074628644292, 3.5296155433144056, 0.06213234965530802], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 498.61538461538464, 119, 1214, 469.0, 1080.3999999999999, 1214.0, 1214.0, 0.0723077864361717, 0.014334453756389505, 0.04905979019617659], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/567d6779-5057-4d64-b7dd-a0192b8b4f9d", 3, 0, 0.0, 379.6666666666667, 223, 538, 378.0, 538.0, 538.0, 538.0, 0.016489677461908846, 0.022732351579161446, 0.010574435091132952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 379.17647058823536, 218, 1079, 235.0, 760.5999999999997, 1079.0, 1079.0, 0.08425936022363426, 6.052520996689102, 0.18823312613378404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f178b91-f3f6-4759-8816-3f57d90e963c", 3, 0, 0.0, 602.0, 242, 1041, 523.0, 1041.0, 1041.0, 1041.0, 0.07557817302363076, 0.03419715511160377, 0.04846647163299239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f93c88d7-c4c4-446c-8b35-7d9fce7285b1", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 698.65, 224, 1811, 603.0, 1268.0000000000002, 1784.5999999999997, 1811.0, 0.08688625720069856, 0.053370562284413475, 0.03928548543351898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 126.4375, 103, 330, 115.0, 188.60000000000014, 330.0, 330.0, 0.08630966830115601, 0.06414224372771457, 0.043323407721478704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 178.18749999999997, 104, 342, 114.5, 330.1, 342.0, 342.0, 0.08631618698244005, 0.0960204360316133, 0.0451495191918647], "isController": false}, {"data": ["login", 20, 0, 0.0, 2797.9500000000003, 1800, 4431, 2746.0, 3726.2000000000003, 4396.25, 4431.0, 0.08512123391740686, 10.304266183142591, 0.14254481632965751], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2f9f234-3ff5-4b3b-96d5-94b4b546cc09", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 124.1111111111111, 112, 185, 119.0, 144.50000000000006, 185.0, 185.0, 0.10521762512129254, 0.08518106564995265, 0.03740157767983446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 866.6875000000001, 222, 1523, 1116.5, 1478.9, 1523.0, 1523.0, 0.08625615922886994, 58.10418417340992, 0.1815780598024734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64d39cf3-a431-4054-a4ae-07c005acdfbc", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bd0203f-1ac0-4c3e-b1a0-3c19ed280714", 3, 0, 0.0, 377.3333333333333, 229, 603, 300.0, 603.0, 603.0, 603.0, 0.020286307418702625, 0.023977728592874094, 0.013009122921498752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 330.8666666666667, 222, 479, 249.0, 464.0, 479.0, 479.0, 0.07702696457273142, 0.11937675075871561, 0.17323544864355517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, 66.66666666666667, 526.6666666666667, 115, 1390, 118.0, 1390.0, 1390.0, 1390.0, 0.03455126544009674, 13.784605251792346, 0.04123207653105295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3c9a00-8f8b-49c6-b1b3-4fd5449aeaf3", 3, 0, 0.0, 418.6666666666667, 233, 589, 434.0, 589.0, 589.0, 589.0, 0.020071722956698606, 0.023724097023363484, 0.012871515047101644], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1375.3333333333333, 480, 2105, 1457.0, 1958.8000000000002, 2093.1, 2105.0, 0.08747485098034316, 0.027921660022743464, 0.03946619253214701], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d113de09-c7c5-464b-ad54-f05e56912b88", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.587014590992647, 1.096837660845588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 135.1875, 111, 350, 122.5, 198.10000000000014, 350.0, 350.0, 0.07545568157702374, 0.05858131528684949, 0.02682213681058266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 374.0, 222, 1345, 231.5, 1124.5000000000005, 1345.0, 1345.0, 0.10717603067616167, 14.394289824826732, 0.23799451690404172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e1b094b-626b-4269-982e-d394e8781665", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 362.11764705882354, 220, 543, 434.0, 474.99999999999994, 543.0, 543.0, 0.11078527207559466, 0.17169553396871948, 0.24915867342782666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 114.9, 105, 124, 115.5, 123.5, 124.0, 124.0, 0.04776666937344459, 0.03549847206366342, 0.02397662896284231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64d39cf3-a431-4054-a4ae-07c005acdfbc", 3, 0, 0.0, 719.3333333333333, 215, 1622, 321.0, 1622.0, 1622.0, 1622.0, 0.07122845339284865, 0.03222902025262358, 0.045677100645804644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 135.60000000000002, 107, 342, 114.0, 319.30000000000007, 342.0, 342.0, 0.04776872295096063, 0.019956503592207964, 0.026841917173811274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 225.59999999999997, 103, 1241, 114.0, 1128.4000000000005, 1241.0, 1241.0, 0.047767582052764074, 4.3097228002431365, 0.02767161100947231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 168.4, 105, 677, 114.5, 620.9000000000002, 677.0, 677.0, 0.04776781022804352, 1.4161196506023521, 0.027718391442874475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 0.014728625082848517, 0.004343793725605715, 0.009104706716253038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bd0203f-1ac0-4c3e-b1a0-3c19ed280714", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1267.310344827586, 849, 1902, 1198.5, 1745.4, 1803.6499999999999, 1902.0, 0.2615475497954969, 312.90179819577287, 0.5164542438344675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1375.3333333333333, 480, 2105, 1457.0, 1958.8000000000002, 2093.1, 2105.0, 0.08476834023589819, 0.027057751459226426, 0.03824509100486812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 144.7142857142857, 108, 325, 115.0, 325.0, 325.0, 325.0, 0.054638410802794364, 0.014726759161690667, 0.03217476729891113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 111.28571428571428, 107, 114, 113.0, 114.0, 114.0, 114.0, 0.05463755785727109, 0.014726529266217599, 0.032120908037184766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2680948-c365-41f5-967f-795b19cdf649", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 201.37499999999997, 105, 1121, 111.0, 575.0000000000006, 1121.0, 1121.0, 0.0722569456989053, 4.08181620796678, 0.042091082138083026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 239.8125, 108, 845, 115.0, 493.60000000000036, 845.0, 845.0, 0.07225759833807524, 1.3461417688434267, 0.042162026374023394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 140.37499999999997, 107, 340, 114.0, 330.90000000000003, 340.0, 340.0, 0.0722562930715247, 0.0536982803002249, 0.036269272108167674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 139.57142857142856, 102, 317, 114.0, 317.0, 317.0, 317.0, 0.054639263774948675, 0.01462027175228119, 0.031161455121650417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 180.4375, 107, 341, 113.5, 337.5, 341.0, 341.0, 0.07225661938374135, 0.026117169188874287, 0.04082957655363022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 114.71428571428571, 111, 123, 113.0, 123.0, 123.0, 123.0, 0.05463755785727109, 0.04060466946228838, 0.027425492908825528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 149.57142857142856, 116, 338, 118.0, 338.0, 338.0, 338.0, 0.05357334190506804, 0.04216807966355941, 0.019043648880317152], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 552.2307692307693, 117, 1622, 523.0, 1224.7999999999997, 1622.0, 1622.0, 0.07371996620223088, 0.014304287312226742, 0.05016745596649711], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1613.1499999999999, 1147, 2647, 1509.0, 2296.8, 2630.45, 2647.0, 0.08542372302212047, 0.044213450392308444, 0.039291575725994864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 262.14285714285717, 225, 441, 235.0, 441.0, 441.0, 441.0, 0.05458855823819327, 0.08460160344141868, 0.12277094689703039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46c283b0-6457-43b8-b729-fef9748a7e95", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=919cc5ea-225c-4924-b045-4a7946407ad5", 1, 0, 0.0, 1214.0, 1214, 1214, 1214.0, 1214.0, 1214.0, 1214.0, 0.8237232289950577, 0.1488171849258649, 0.5679185543657331], "isController": false}, {"data": ["addBook", 58, 3, 5.172413793103448, 1259.0689655172414, 581, 3655, 973.5, 2131.6, 2791.849999999999, 3655.0, 0.28260286988086825, 82.64280599830681, 1.0303071022242793], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 216.34482758620692, 105, 467, 117.0, 459.0, 463.0, 467.0, 0.2633993042625274, 0.1957488970154134, 0.1273268121190928], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 728.1379310344829, 519, 1131, 676.5, 955.1, 1013.05, 1131.0, 0.26283471774723455, 77.28213395167467, 0.1321873824607674], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 152.86206896551727, 107, 475, 116.0, 333.7, 345.19999999999993, 475.0, 0.26384744158963536, 0.4668862931254094, 0.12831643155433436], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1044.5517241379307, 739, 1558, 1013.5, 1318.7, 1376.1499999999999, 1558.0, 0.26213030587895003, 235.86531000580754, 0.13157712619314482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 131.2941176470588, 109, 344, 118.0, 173.59999999999985, 344.0, 344.0, 0.11009293138619954, 0.08224716065472915, 0.039134596703688115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, 1.7241379310344827, 229.24137931034485, 104, 2406, 122.5, 348.0, 469.75, 2289.0, 0.7403688228135717, 1.5661491553306555, 0.35560773536495077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 120.69999999999999, 116, 136, 117.0, 135.4, 136.0, 136.0, 0.047263669834908005, 0.036601650565509805, 0.01680075763662745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=567d6779-5057-4d64-b7dd-a0192b8b4f9d", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 114.60000000000001, 109, 121, 116.0, 119.2, 121.0, 121.0, 0.07667653238049962, 0.06222480313300311, 0.027256111119630725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 343.59999999999997, 220, 1358, 232.0, 1246.2000000000003, 1358.0, 1358.0, 0.04774021683606487, 5.7779788627206194, 0.10614738837143797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2f9f234-3ff5-4b3b-96d5-94b4b546cc09", 3, 0, 0.0, 357.0, 213, 486, 372.0, 486.0, 486.0, 486.0, 0.01860476654118785, 0.021990204202816763, 0.011930791043665387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f178b91-f3f6-4759-8816-3f57d90e963c", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 441.00000000000006, 223, 1461, 440.5, 896.8000000000006, 1461.0, 1461.0, 0.07221846084405326, 5.504828375366734, 0.16126615041751297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fac3bb95-ea10-48f4-bcc5-5c06f2fb1d79", 3, 0, 0.0, 373.6666666666667, 241, 491, 389.0, 491.0, 491.0, 491.0, 0.018506751879977544, 0.025513051501206023, 0.011867936589699141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 140.0, 115, 443, 119.0, 206.99999999999977, 443.0, 443.0, 0.08309870170498983, 0.06889726342532848, 0.029538991621695605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 147.375, 103, 358, 117.5, 348.90000000000003, 358.0, 358.0, 0.08345765045849547, 0.06479378136182021, 0.02966658668641831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ff382c8-7ef1-474d-9879-603ba51aec3a", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.79833984375, 1.49169921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8255bc0-bfaf-4fca-af95-b3c721d87415", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3c9a00-8f8b-49c6-b1b3-4fd5449aeaf3", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 111.88235294117646, 105, 120, 112.0, 117.6, 120.0, 120.0, 0.11086763708457244, 0.0823928435755465, 0.05565035689596702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 189.8235294117647, 104, 340, 115.0, 339.2, 340.0, 340.0, 0.11086474501108648, 0.02966498059866962, 0.06322754988913526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 162.41176470588235, 106, 338, 114.0, 328.4, 338.0, 338.0, 0.11086691405205529, 0.029882097928093026, 0.06517761939388407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 235.17647058823528, 105, 426, 317.0, 359.59999999999997, 426.0, 426.0, 0.11086980623870922, 0.029882877462777093, 0.06528759097845865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 21.428571428571427, 0.23059185242121444], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 14.285714285714286, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 14.285714285714286, 0.15372790161414296], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5380476556495004], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 14, "401/Unauthorized", 7, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
