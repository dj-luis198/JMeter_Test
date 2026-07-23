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

    var data = {"OkPercent": 99.04306220095694, "KoPercent": 0.9569377990430622};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7776252573781743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4439521-11b0-4d2f-a3d3-841b457d4473"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd352623-8b5d-4cbb-b875-42681d22570f"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a040fe4b-486e-4ef0-a0ad-1ffcd1cd093c"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f6d30d6-2151-4022-bf0c-79633559019e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7395c677-7da1-4437-ad88-87e80ac41e87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6af8556-05b7-45d3-a84c-8db77accf3cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26fb7bcd-f77e-4bfa-89ce-057bcd5eb584"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afa7c488-f43c-41e0-a3e5-0600c063c5b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de60d00f-76aa-4968-a165-30fd8f8e0f9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aee2ece0-fb80-4b86-ad53-019f1091bc5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3488261-cf9a-4f5c-829c-68eb7009793d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87631dad-5474-43a1-b8f3-11530706301c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd352623-8b5d-4cbb-b875-42681d22570f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cd12581-a546-4d71-ab8d-5208b13b48bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b82b4bc1-0207-4ab2-a16d-77ab273bed1e"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a040fe4b-486e-4ef0-a0ad-1ffcd1cd093c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f6d30d6-2151-4022-bf0c-79633559019e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37eee5cf-0818-408f-98e1-6e0f55d3aa75"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26fb7bcd-f77e-4bfa-89ce-057bcd5eb584"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9315476190476191, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4439521-11b0-4d2f-a3d3-841b457d4473"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6af8556-05b7-45d3-a84c-8db77accf3cf"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aee2ece0-fb80-4b86-ad53-019f1091bc5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de60d00f-76aa-4968-a165-30fd8f8e0f9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afa7c488-f43c-41e0-a3e5-0600c063c5b9"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c82d3f3-b393-4a4b-ad4c-c6e0c9b554db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37eee5cf-0818-408f-98e1-6e0f55d3aa75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30d53b31-b156-439b-8eb5-65b5935c8bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7cd12581-a546-4d71-ab8d-5208b13b48bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87631dad-5474-43a1-b8f3-11530706301c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1254, 12, 0.9569377990430622, 401.91307814992064, 101, 3365, 134.0, 1125.5, 1339.25, 1887.450000000001, 4.886069636233285, 702.3728564695126, 3.562743889490664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1770.9999999999998, 1352, 2448, 1741.0, 2163.0, 2264.75, 2448.0, 0.24317094917727164, 292.61693138244937, 1.1956696573316041], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c4439521-11b0-4d2f-a3d3-841b457d4473", 3, 0, 0.0, 518.0, 319, 880, 355.0, 880.0, 880.0, 880.0, 0.03421884089379613, 0.021999417566812285, 0.02194372283879504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd352623-8b5d-4cbb-b875-42681d22570f", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 565.5833333333334, 440, 1392, 474.5, 1177.2000000000007, 1392.0, 1392.0, 0.06689708997658601, 0.01208590004459806, 0.04546911584346081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 565.5833333333334, 440, 1392, 474.5, 1177.2000000000007, 1392.0, 1392.0, 0.06862672210180774, 0.012398382410971125, 0.046644725178572446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 137.57142857142858, 104, 332, 107.5, 320.5, 332.0, 332.0, 0.09743536207676515, 0.04697776385844034, 0.05439959807913143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 110.64285714285715, 104, 129, 110.0, 122.5, 129.0, 129.0, 0.0974333277657146, 0.07240894768526251, 0.04890696335114972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 227.64285714285717, 102, 824, 113.0, 719.5, 824.0, 824.0, 0.09743468396364294, 4.115228910610637, 0.056179903574460975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 309.2857142857143, 105, 1217, 112.0, 1197.5, 1217.0, 1217.0, 0.0974333277657146, 12.546892507551084, 0.056083971869606376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a040fe4b-486e-4ef0-a0ad-1ffcd1cd093c", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 282.38461538461536, 207, 407, 260.0, 405.8, 407.0, 407.0, 0.06093616702134641, 0.12303502833531767, 0.03939427985169074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f6d30d6-2151-4022-bf0c-79633559019e", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7395c677-7da1-4437-ad88-87e80ac41e87", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 140.0625, 104, 345, 111.5, 339.4, 345.0, 345.0, 0.11101243339253997, 0.08250045098801066, 0.05572303785523979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 162.5, 104, 322, 114.5, 316.4, 322.0, 322.0, 0.11101551441813994, 0.060969091719630324, 0.06156536645527463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 757.0, 612, 952, 732.0, 952.0, 952.0, 952.0, 0.02943773918163085, 8.655672744333236, 0.016788710627023844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1230.75, 1175, 1339, 1204.5, 1339.0, 1339.0, 1339.0, 0.02938950647671249, 26.44472958898775, 0.016732502222581425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 161.25, 103, 328, 107.0, 328.0, 328.0, 328.0, 0.029622827350756494, 0.05241851871051832, 0.016402483503788017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 123.94117647058823, 104, 328, 111.0, 166.39999999999986, 328.0, 328.0, 0.0835155117781435, 0.06206572701481172, 0.04192087212301344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6af8556-05b7-45d3-a84c-8db77accf3cf", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 134.9411764705882, 103, 321, 112.0, 312.2, 321.0, 321.0, 0.0835200251542664, 0.029727141306056675, 0.047219903927406354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 206.47058823529412, 103, 1137, 111.0, 487.3999999999994, 1137.0, 1137.0, 0.08351838387014365, 4.441774214497317, 0.04867747717982982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 205.35294117647058, 103, 644, 113.0, 479.9999999999999, 644.0, 644.0, 0.08351674265052665, 1.4656977240459441, 0.048758079937804594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 113.25, 108, 119, 113.0, 119.0, 119.0, 119.0, 0.02961953704663596, 0.022012175480947235, 0.016632064259585622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 872.4000000000001, 104, 1549, 1154.0, 1417.6000000000001, 1549.0, 1549.0, 0.07511116452349477, 45.06352018174398, 0.03985390565536995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 326.875, 104, 1235, 112.5, 1195.8, 1235.0, 1235.0, 0.11101320363290709, 18.753662947868893, 0.06347483469440146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 569.6000000000001, 106, 968, 719.0, 908.6, 968.0, 968.0, 0.07518608556176537, 14.744892045312147, 0.03996708259191499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 226.125, 104, 828, 111.5, 676.8000000000002, 828.0, 828.0, 0.11101012273556694, 6.144434685286302, 0.0635814814300879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26fb7bcd-f77e-4bfa-89ce-057bcd5eb584", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 605.0833333333334, 262, 1096, 480.0, 1043.8000000000002, 1096.0, 1096.0, 0.06870530576723788, 0.012412579655213874, 0.04736908776530268], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 373.76470588235287, 219, 1248, 231.0, 763.9999999999995, 1248.0, 1248.0, 0.08346917532454778, 5.995760410324646, 0.186467874494275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afa7c488-f43c-41e0-a3e5-0600c063c5b9", 3, 0, 0.0, 424.3333333333333, 232, 544, 497.0, 544.0, 544.0, 544.0, 0.019560539870900437, 0.023119895921627436, 0.012543705581274043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de60d00f-76aa-4968-a165-30fd8f8e0f9b", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 0.19594800704989154, 0.7477799620390455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 111.66666666666666, 105, 120, 111.0, 118.8, 120.0, 120.0, 0.07518457813933206, 0.055874476527374706, 0.037739133948844414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 835.1904761904761, 212, 1984, 805.0, 1675.6000000000001, 1954.4999999999995, 1984.0, 0.0890551251224508, 0.05470280634963042, 0.04026613567548312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 200.8, 105, 331, 120.0, 330.4, 331.0, 331.0, 0.07510326699211416, 0.09529704906746778, 0.03862733133057955], "isController": false}, {"data": ["login", 21, 0, 0.0, 3208.9047619047624, 1889, 5531, 3021.0, 4979.8, 5488.9, 5531.0, 0.08719880080887268, 19.99172811673428, 0.1591061824468814], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aee2ece0-fb80-4b86-ad53-019f1091bc5e", 3, 0, 0.0, 398.66666666666663, 238, 664, 294.0, 664.0, 664.0, 664.0, 0.040870820958556986, 0.0262759998024577, 0.026209478283970463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.74999999999999, 107, 140, 117.0, 133.0, 140.0, 140.0, 0.10835263364620155, 0.08771907548115342, 0.038515975241423216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 987.6000000000003, 217, 1655, 1262.0, 1526.6000000000001, 1655.0, 1655.0, 0.07506004803843074, 59.904051170624, 0.1560085959392514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3488261-cf9a-4f5c-829c-68eb7009793d", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87631dad-5474-43a1-b8f3-11530706301c", 3, 0, 0.0, 929.6666666666666, 407, 1268, 1114.0, 1268.0, 1268.0, 1268.0, 0.06919138336639144, 0.0313072991143503, 0.04437077644264035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd352623-8b5d-4cbb-b875-42681d22570f", 3, 0, 0.0, 380.0, 257, 587, 296.0, 587.0, 587.0, 587.0, 0.020315155783386267, 0.02436892873104765, 0.013027622686611635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 437.2142857142857, 212, 1326, 237.0, 1306.5, 1326.0, 1326.0, 0.09735744089012517, 16.768379476703753, 0.21540062152294853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1344.25, 1284, 1447, 1323.0, 1447.0, 1447.0, 1447.0, 0.0293638325674267, 35.12935227055835, 0.06621200136541822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cd12581-a546-4d71-ab8d-5208b13b48bf", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b82b4bc1-0207-4ab2-a16d-77ab273bed1e", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.7639615729665072, 1.4274633672248804], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1297.4545454545455, 419, 2315, 1208.0, 2072.7, 2298.0499999999997, 2315.0, 0.09271160370003581, 0.029318069280852947, 0.0418288680756021], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 129.88235294117646, 111, 312, 119.0, 171.9999999999999, 312.0, 312.0, 0.08806875579570121, 0.06837369224373287, 0.03130569053675316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 509.81249999999994, 217, 1525, 231.5, 1395.5000000000002, 1525.0, 1525.0, 0.11092469599700504, 25.02177195052412, 0.24415078045922825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 390.31249999999994, 212, 1261, 229.5, 847.3000000000004, 1261.0, 1261.0, 0.08686069173683382, 6.62092759923834, 0.19396272386986096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a040fe4b-486e-4ef0-a0ad-1ffcd1cd093c", 3, 0, 0.0, 294.3333333333333, 211, 448, 224.0, 448.0, 448.0, 448.0, 0.020488164670208843, 0.02457646055003893, 0.013138569140726374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 159.75, 106, 312, 109.5, 312.0, 312.0, 312.0, 0.04694560178393287, 0.034888284138254795, 0.02356449152045068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f6d30d6-2151-4022-bf0c-79633559019e", 3, 0, 0.0, 482.6666666666667, 404, 591, 453.0, 591.0, 591.0, 591.0, 0.024666387114279372, 0.029154834509097786, 0.01581796309086275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 188.75, 104, 334, 114.0, 334.0, 334.0, 334.0, 0.04699965925247042, 0.012576080698414937, 0.026804493167424535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 135.12500000000003, 104, 309, 111.0, 309.0, 309.0, 309.0, 0.04699855479444007, 0.012667579221938926, 0.027630009752200122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 162.375, 102, 331, 108.5, 331.0, 331.0, 331.0, 0.04699772648498129, 0.012667355966655114, 0.027675419014105192], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1203.2222222222222, 822, 1939, 1124.0, 1682.5, 1804.75, 1939.0, 0.2396527697646965, 286.7080294218155, 0.47322060592208626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1297.4545454545455, 419, 2315, 1208.0, 2072.7, 2298.0499999999997, 2315.0, 0.09165139143476088, 0.028982799741709715, 0.04135053011998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 164.62500000000003, 104, 333, 113.0, 333.0, 333.0, 333.0, 0.03552650277106722, 0.009575502700014211, 0.020920391768509308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 170.5, 105, 338, 117.0, 338.0, 338.0, 338.0, 0.03552539843954688, 0.009575205048159119, 0.020885048691999235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 169.41176470588235, 101, 343, 109.0, 326.2, 343.0, 343.0, 0.08573863836955371, 0.023109242373043775, 0.050404941697725913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 171.23529411764704, 104, 334, 110.0, 327.6, 334.0, 334.0, 0.08573734113375026, 0.023108892727456122, 0.05048790693715957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 109.99999999999999, 103, 120, 110.0, 120.0, 120.0, 120.0, 0.035525713955832657, 0.009505903929588035, 0.020260758740435814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 136.35294117647055, 105, 345, 111.0, 333.0, 345.0, 345.0, 0.08573474677990377, 0.06371498271436209, 0.04303482406725639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 137.49999999999997, 104, 337, 107.5, 337.0, 337.0, 337.0, 0.035524767423788274, 0.02640073047803015, 0.01783176802326872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 122.3529411764706, 102, 324, 111.0, 156.79999999999984, 324.0, 324.0, 0.08573474677990377, 0.02294074279071644, 0.04889559777291387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 149.25, 110, 339, 122.0, 339.0, 339.0, 339.0, 0.03482439797322004, 0.027410610123452493, 0.012378985217043061], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 618.5833333333333, 422, 1114, 542.5, 1043.8000000000002, 1114.0, 1114.0, 0.06815935657567393, 0.01231394625634734, 0.0463936245441843], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/37eee5cf-0818-408f-98e1-6e0f55d3aa75", 3, 0, 0.0, 371.3333333333333, 260, 454, 400.0, 454.0, 454.0, 454.0, 0.05250630075609073, 0.03375649218531224, 0.03367103271142537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1735.3333333333333, 1161, 3365, 1490.0, 3072.6000000000004, 3351.7999999999997, 3365.0, 0.08727127652942913, 0.045169703672458435, 0.04014137816929797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 311.375, 214, 675, 230.0, 675.0, 675.0, 675.0, 0.03550695048555755, 0.05502883830134749, 0.07985596383617093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26fb7bcd-f77e-4bfa-89ce-057bcd5eb584", 3, 0, 0.0, 632.3333333333334, 221, 1178, 498.0, 1178.0, 1178.0, 1178.0, 0.03199112779389183, 0.026669686940155264, 0.020515143800119436], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1295.4035087719294, 581, 4143, 944.0, 2135.6000000000004, 2604.4999999999945, 4143.0, 0.2538918955034409, 91.56261396600298, 0.920549514487428], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 202.40740740740742, 107, 563, 114.5, 439.0, 454.75, 563.0, 0.2405355925861585, 0.17875740816217445, 0.11627452961928561], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 679.9074074074075, 510, 1097, 643.5, 883.0, 965.0, 1097.0, 0.2401686517643501, 70.61755796848453, 0.1207879449791409], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 168.2777777777778, 104, 363, 113.5, 334.5, 338.75, 363.0, 0.24092945228704513, 0.42633219486731033, 0.11717076878803562], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 997.8148148148149, 707, 1454, 984.0, 1267.5, 1371.25, 1454.0, 0.24024344669264855, 216.1714756369788, 0.12059094882814586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 121.24999999999999, 108, 151, 117.0, 145.4, 151.0, 151.0, 0.08460505303679261, 0.06320592341127573, 0.030074452446672378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, 4.166666666666667, 225.9880952380952, 105, 3349, 120.5, 344.4, 429.19999999999993, 2373.3400000000033, 0.680415377387529, 1.4680474356845465, 0.3272782460977368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 144.125, 112, 331, 116.5, 331.0, 331.0, 331.0, 0.047212959957508335, 0.03656238012334386, 0.016782731859895542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4439521-11b0-4d2f-a3d3-841b457d4473", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 116.7142857142857, 107, 137, 115.0, 131.5, 137.0, 137.0, 0.09329041974025282, 0.07570736211342782, 0.033161828892043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6af8556-05b7-45d3-a84c-8db77accf3cf", 3, 0, 0.0, 485.0, 326, 702, 427.0, 702.0, 702.0, 702.0, 0.08710295569362987, 0.03941181914522966, 0.05585703864467801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 354.125, 216, 647, 232.5, 647.0, 647.0, 647.0, 0.04691119125106283, 0.07270318409710616, 0.10550436860468526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aee2ece0-fb80-4b86-ad53-019f1091bc5e", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de60d00f-76aa-4968-a165-30fd8f8e0f9b", 3, 0, 0.0, 300.0, 215, 422, 263.0, 422.0, 422.0, 422.0, 0.029372026082359164, 0.024486249608372986, 0.018835576621825372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afa7c488-f43c-41e0-a3e5-0600c063c5b9", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 337.0588235294117, 216, 669, 227.0, 659.4, 669.0, 669.0, 0.08568591575562377, 0.13279643389079582, 0.19270963279804837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c82d3f3-b393-4a4b-ad4c-c6e0c9b554db", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37eee5cf-0818-408f-98e1-6e0f55d3aa75", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30d53b31-b156-439b-8eb5-65b5935c8bff", 2, 0, 0.0, 328.0, 238, 418, 328.0, 418.0, 418.0, 418.0, 0.01745566261695294, 0.029831454667644187, 0.0108501262262603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 116.47058823529412, 109, 135, 115.0, 129.4, 135.0, 135.0, 0.08169502765616965, 0.06773347507821097, 0.029040029362154055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cd12581-a546-4d71-ab8d-5208b13b48bf", 3, 0, 0.0, 530.0, 207, 841, 542.0, 841.0, 841.0, 841.0, 0.059131943075649465, 0.026755664347380453, 0.03791989839161115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 119.6, 110, 138, 119.0, 132.6, 138.0, 138.0, 0.07261109497531223, 0.05637287158727853, 0.025810975167005517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 125.25, 105, 336, 111.0, 182.70000000000016, 336.0, 336.0, 0.08691400945189852, 0.06459136835243631, 0.04362675865066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 137.00000000000003, 104, 341, 108.5, 327.0, 341.0, 341.0, 0.0869163701550914, 0.03141593896841133, 0.04911326629002906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 219.37500000000003, 103, 1150, 108.0, 640.4000000000005, 1150.0, 1150.0, 0.08691448158227814, 4.909824740003477, 0.05062938307014542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 229.18750000000003, 105, 864, 110.5, 556.7000000000003, 864.0, 864.0, 0.08691542585842564, 1.6192135885478063, 0.0507148114750091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87631dad-5474-43a1-b8f3-11530706301c", 1, 0, 0.0, 1096.0, 1096, 1096, 1096.0, 1096.0, 1096.0, 1096.0, 0.9124087591240876, 0.1648394730839416, 0.6290630702554744], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.39872408293460926], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5582137161084529], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1254, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
