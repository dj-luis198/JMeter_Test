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

    var data = {"OkPercent": 98.36065573770492, "KoPercent": 1.639344262295082};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.740550928891736, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76f83d63-763f-4c7d-9c54-3c1a12c339c0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7aa9161d-964c-448c-bd72-1c173afe3f5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=848092d8-f580-4d53-85a9-cbf4e8df2eae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69962129-0a3c-49e5-834b-9165893dfe00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eddf7c0-f4f1-4ba6-a907-f55b722cf9c5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80296617-bf81-420d-a98c-5ccc7f189c73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef136b82-7a23-4707-8d28-15605cbd958c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=165cfda7-5f9e-47a5-a0d6-fe6ff139816d"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d2ed34e6-96dd-4fa1-a876-dd362cf3fbc4"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dffd5884-0722-431f-8bec-adb8cc10110c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d4f6752-6e3b-42ed-9733-3f72bfe077d9"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bce3bf1-5a23-422c-a94e-07518fe6dfe7"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3973fe0d-74e9-4c89-a8fd-2527adaeca08"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76f83d63-763f-4c7d-9c54-3c1a12c339c0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69962129-0a3c-49e5-834b-9165893dfe00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1ab45c1-38a7-4f6f-80ff-48cde2db04c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1be9a6d4-1a7e-4dff-aa03-8f82d360c651"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1bce3bf1-5a23-422c-a94e-07518fe6dfe7"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/165cfda7-5f9e-47a5-a0d6-fe6ff139816d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9eddf7c0-f4f1-4ba6-a907-f55b722cf9c5"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9419889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef136b82-7a23-4707-8d28-15605cbd958c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80296617-bf81-420d-a98c-5ccc7f189c73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dffd5884-0722-431f-8bec-adb8cc10110c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/848092d8-f580-4d53-85a9-cbf4e8df2eae"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a793f2a-2158-45b8-b01e-ad900a8d0c8f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1be9a6d4-1a7e-4dff-aa03-8f82d360c651"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d4f6752-6e3b-42ed-9733-3f72bfe077d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2ed34e6-96dd-4fa1-a876-dd362cf3fbc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 22, 1.639344262295082, 446.2205663189269, 125, 2393, 147.0, 1274.8000000000002, 1517.6999999999998, 1929.8299999999988, 5.207504704992142, 727.5753389898334, 3.8063447061562643], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2169.035087719298, 1552, 3004, 2131.0, 2573.4, 2795.7999999999993, 3004.0, 0.244384515454105, 294.07705102786196, 1.2016367532338073], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 657.8571428571428, 143, 1668, 531.5, 1545.0, 1668.0, 1668.0, 0.08648060981184291, 0.017035521910480213, 0.05818861343785133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 657.8571428571428, 143, 1668, 531.5, 1545.0, 1668.0, 1668.0, 0.08697110695582488, 0.017132143278686486, 0.05851864520758139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 171.60000000000002, 127, 400, 133.5, 394.40000000000003, 399.75, 400.0, 0.10288542165017928, 0.042982796271432325, 0.057812765251477695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 134.75, 128, 146, 134.0, 143.9, 145.9, 146.0, 0.10287801239680049, 0.07645524163473162, 0.05163993981636275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 285.15, 125, 1048, 133.0, 958.3000000000011, 1045.8999999999999, 1048.0, 0.10288489238240256, 3.050115070321824, 0.059701370169554305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 256.70000000000005, 125, 1298, 133.0, 1105.5000000000016, 1292.1999999999998, 1298.0, 0.10288118766043035, 9.282224075869731, 0.05959875050797586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76f83d63-763f-4c7d-9c54-3c1a12c339c0", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 382.3571428571429, 138, 2080, 253.0, 1220.5, 2080.0, 2080.0, 0.08654797230464886, 0.17746077329067755, 0.05593983756800198], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7aa9161d-964c-448c-bd72-1c173afe3f5c", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 133.79999999999998, 128, 143, 133.0, 140.0, 142.85, 143.0, 0.10860534446900132, 0.08071158900479493, 0.054514792047916684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 133.20000000000002, 128, 139, 133.0, 138.0, 138.95, 139.0, 0.10861124234969562, 0.029061992581852148, 0.061942349152560784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 938.0, 773, 1076, 1007.0, 1076.0, 1076.0, 1076.0, 0.06326951548205044, 18.603338297354068, 0.03608339554835689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1441.0, 1227, 1566, 1516.0, 1566.0, 1566.0, 1566.0, 0.06278725167641962, 56.49607942665821, 0.03574703879624281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 230.8, 127, 386, 130.0, 386.0, 386.0, 386.0, 0.06358087487283824, 0.11250834498982706, 0.03520542583290946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=848092d8-f580-4d53-85a9-cbf4e8df2eae", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.1788753094059406, 0.6826268564356436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69962129-0a3c-49e5-834b-9165893dfe00", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 134.0, 128, 141, 133.0, 140.6, 141.0, 141.0, 0.07640427586111091, 0.05678091204131387, 0.03835136503184669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 155.9090909090909, 129, 391, 132.0, 340.20000000000016, 391.0, 391.0, 0.07640321449160607, 0.020443828877636776, 0.04357370826474408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 182.27272727272725, 126, 410, 135.0, 407.2, 410.0, 410.0, 0.07640321449160607, 0.020593053905940694, 0.04491673351947934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 244.45454545454547, 125, 557, 137.0, 527.8000000000001, 557.0, 557.0, 0.07640533726010461, 0.02059362605838757, 0.044992596062346756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eddf7c0-f4f1-4ba6-a907-f55b722cf9c5", 1, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 1.1668611435239205, 0.21080987456242709, 0.8044960618436406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80296617-bf81-420d-a98c-5ccc7f189c73", 3, 0, 0.0, 468.3333333333333, 289, 695, 421.0, 695.0, 695.0, 695.0, 0.03651456322496622, 0.02347534582334254, 0.02341591456809357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 181.6, 128, 375, 135.0, 375.0, 375.0, 375.0, 0.06358896095637798, 0.04725703055449574, 0.03570669194327865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 159.05, 127, 401, 132.0, 355.2000000000005, 399.9, 401.0, 0.10861065253280042, 0.029273964940481362, 0.06385118439916587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 863.5263157894735, 129, 1639, 1139.0, 1628.0, 1639.0, 1639.0, 0.12048880405349703, 57.07645559591226, 0.06538449800559322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 156.3, 127, 381, 132.0, 352.3000000000005, 380.75, 381.0, 0.10860652399389631, 0.029272852170229863, 0.06395481832843698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 602.0526315789474, 126, 1189, 750.0, 1135.0, 1189.0, 1189.0, 0.12050332335481252, 18.66379453866254, 0.06551005608161246], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 578.9999999999999, 150, 1010, 565.0, 962.5, 1010.0, 1010.0, 0.08714651196085876, 0.01716669571550399, 0.059195921698859004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef136b82-7a23-4707-8d28-15605cbd958c", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=165cfda7-5f9e-47a5-a0d6-fe6ff139816d", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 406.09090909090907, 263, 689, 280.0, 659.8000000000001, 689.0, 689.0, 0.0763337589518681, 0.11830241743810024, 0.17167641295522676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 705.2857142857142, 183, 1317, 637.0, 1295.2, 1316.6, 1317.0, 0.09287145264219282, 0.057047015343690714, 0.04199168220052273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 174.5263157894737, 128, 415, 133.0, 389.0, 415.0, 415.0, 0.12068779338249773, 0.08969083082429762, 0.06057961503769905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 225.73684210526315, 126, 404, 134.0, 395.0, 404.0, 404.0, 0.12069545994498827, 0.12770542446687547, 0.06349911225313014], "isController": false}, {"data": ["login", 21, 0, 0.0, 2914.0952380952376, 1692, 4941, 2702.0, 4391.0, 4888.199999999999, 4941.0, 0.0931615021183151, 26.664668327030146, 0.1773421730474902], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d2ed34e6-96dd-4fa1-a876-dd362cf3fbc4", 3, 0, 0.0, 972.3333333333334, 259, 2080, 578.0, 2080.0, 2080.0, 2080.0, 0.030501133625466414, 0.024792099825126833, 0.019559646237685167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 161.60000000000002, 128, 575, 141.0, 148.0, 553.6499999999996, 575.0, 0.10576862056565058, 0.08562713520402766, 0.037597439341696105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dffd5884-0722-431f-8bec-adb8cc10110c", 3, 0, 0.0, 370.6666666666667, 236, 626, 250.0, 626.0, 626.0, 626.0, 0.044515008977193474, 0.03711033137714599, 0.028546408751650765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d4f6752-6e3b-42ed-9733-3f72bfe077d9", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1053.4210526315792, 262, 1773, 1272.0, 1758.0, 1773.0, 1773.0, 0.12038421572851458, 75.8890995557664, 0.2545356436278734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bce3bf1-5a23-422c-a94e-07518fe6dfe7", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 472.5499999999999, 263, 1432, 280.0, 1252.0000000000014, 1426.25, 1432.0, 0.10280450694958468, 12.442387310197178, 0.22857939592071716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 963.6666666666666, 138, 1892, 1366.0, 1892.0, 1892.0, 1892.0, 0.09679188668896464, 64.34303683200154, 0.14975645749760708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3973fe0d-74e9-4c89-a8fd-2527adaeca08", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1201.217391304348, 461, 1808, 1188.0, 1724.4, 1797.1999999999998, 1808.0, 0.09213673090866847, 0.029168285736032272, 0.04156950164043441], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 308.1, 261, 539, 272.0, 512.1, 537.6999999999999, 539.0, 0.10852343020858203, 0.16819012084083954, 0.2440717380569965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.66666666666669, 132, 160, 143.0, 156.4, 160.0, 160.0, 0.07923762836495796, 0.061517494677872625, 0.028166500707856146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76f83d63-763f-4c7d-9c54-3c1a12c339c0", 3, 0, 0.0, 391.66666666666663, 249, 674, 252.0, 674.0, 674.0, 674.0, 0.056780543200529957, 0.026357114128891832, 0.03641200198731901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 563.7857142857143, 264, 1518, 518.0, 1515.0, 1518.0, 1518.0, 0.10768071130801297, 18.54641014621502, 0.23824056928484622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69962129-0a3c-49e5-834b-9165893dfe00", 3, 0, 0.0, 467.33333333333337, 262, 759, 381.0, 759.0, 759.0, 759.0, 0.03731482518004404, 0.031107834403024986, 0.023929103386942298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ab45c1-38a7-4f6f-80ff-48cde2db04c8", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 159.08333333333331, 127, 393, 138.0, 320.40000000000026, 393.0, 393.0, 0.06375382522951378, 0.04737955175748045, 0.03200143180465828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 156.33333333333331, 126, 380, 132.0, 318.8000000000002, 380.0, 380.0, 0.0637606001997832, 0.033021847303989285, 0.035470984941871585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 356.75000000000006, 133, 1387, 137.0, 1342.6000000000001, 1387.0, 1387.0, 0.06375856755751555, 9.575999299319909, 0.0365698554805802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 310.25, 125, 1098, 138.0, 1070.4, 1098.0, 1098.0, 0.06375822879640403, 3.1388267356849493, 0.036631925073454794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 152.5, 150, 155, 152.5, 155.0, 155.0, 155.0, 0.04276702662247407, 0.01261293167967497, 0.026437038917994225], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1524.5087719298247, 1016, 2393, 1481.0, 2017.2, 2245.2999999999997, 2393.0, 0.24659205454443198, 295.0098265041034, 0.48692298270394674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1201.217391304348, 461, 1808, 1188.0, 1724.4, 1797.1999999999998, 1808.0, 0.090175567910044, 0.02854742842804382, 0.040684680053164377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 130.0, 127, 134, 129.0, 134.0, 134.0, 134.0, 0.03729395092116059, 0.010051885209219064, 0.02196118398970687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 164.375, 127, 398, 132.5, 398.0, 398.0, 398.0, 0.037247069121248526, 0.010039249099086515, 0.021897202745108993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 152.6, 128, 413, 134.0, 250.4000000000001, 413.0, 413.0, 0.08367220576668842, 0.02255227421055274, 0.04919010534330706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 168.06666666666666, 127, 397, 135.0, 386.2, 397.0, 397.0, 0.08367407275181711, 0.02255277742138821, 0.04927291588803293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 130.5, 128, 135, 129.0, 135.0, 135.0, 135.0, 0.037292733976943764, 0.009978719833674406, 0.021268512346225742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 170.60000000000002, 127, 406, 137.0, 403.0, 406.0, 406.0, 0.08367407275181711, 0.06218356383216097, 0.04200046229925195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 132.75000000000003, 127, 140, 133.5, 140.0, 140.0, 140.0, 0.037292560134253215, 0.027714490490397165, 0.01871911709863882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 167.33333333333334, 126, 394, 132.0, 394.0, 394.0, 394.0, 0.08367220576668842, 0.022388851933664678, 0.047719304851314495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1be9a6d4-1a7e-4dff-aa03-8f82d360c651", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 170.625, 135, 381, 139.5, 381.0, 381.0, 381.0, 0.03881403709651596, 0.03055089248026549, 0.013797177249152156], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 536.9285714285714, 139, 837, 552.5, 798.0, 837.0, 837.0, 0.08674854076561783, 0.016749439232647195, 0.05903451197749495], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1bce3bf1-5a23-422c-a94e-07518fe6dfe7", 3, 0, 0.0, 433.33333333333337, 258, 701, 341.0, 701.0, 701.0, 701.0, 0.027192632609405024, 0.027272298525252894, 0.017437983802255176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1528.6190476190475, 842, 2264, 1456.0, 2154.2, 2253.2999999999997, 2264.0, 0.09181692579443501, 0.04752243229594781, 0.042232199266776266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 300.625, 262, 535, 268.0, 535.0, 535.0, 535.0, 0.03722332599723617, 0.05768888511485722, 0.0837161325894872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/165cfda7-5f9e-47a5-a0d6-fe6ff139816d", 3, 0, 0.0, 340.3333333333333, 235, 527, 259.0, 527.0, 527.0, 527.0, 0.0411788121285328, 0.026474008448519624, 0.02640698564232084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eddf7c0-f4f1-4ba6-a907-f55b722cf9c5", 3, 0, 0.0, 368.0, 260, 450, 394.0, 450.0, 450.0, 450.0, 0.05869003834415838, 0.03773203962555756, 0.03763651547460678], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 1281.7580645161288, 673, 2995, 1082.0, 2161.5, 2291.65, 2995.0, 0.28282994165492015, 88.40714781399826, 1.0283145701897243], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 246.6140350877193, 127, 556, 139.0, 530.4, 533.2, 556.0, 0.248124915659294, 0.1843975203288308, 0.119943196534522], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 887.1403508771929, 629, 1388, 799.0, 1134.8, 1169.7, 1388.0, 0.24792849220330135, 72.89920870848829, 0.12469059910615254], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 217.36842105263165, 127, 418, 139.0, 393.4, 410.1, 418.0, 0.2483248960956356, 0.4394186637942301, 0.12076738110901027], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1269.1228070175437, 881, 1861, 1259.0, 1621.0, 1689.8999999999994, 1861.0, 0.24723165606172984, 222.45947871123994, 0.12409870235911048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 177.07142857142858, 131, 410, 140.5, 394.0, 410.0, 410.0, 0.09985164897866027, 0.07459620260612804, 0.035494140847883146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, 4.972375690607735, 193.53038674033147, 127, 952, 141.0, 303.0, 397.8, 664.1800000000023, 0.7366017833088477, 1.5596313926148548, 0.35525743164050577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 184.91666666666666, 130, 396, 143.0, 391.8, 396.0, 396.0, 0.062437887310019716, 0.048352777965669565, 0.022194717754733573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef136b82-7a23-4707-8d28-15605cbd958c", 3, 0, 0.0, 460.3333333333333, 361, 516, 504.0, 516.0, 516.0, 516.0, 0.019349595593452097, 0.02667497960230131, 0.012408432070019737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80296617-bf81-420d-a98c-5ccc7f189c73", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dffd5884-0722-431f-8bec-adb8cc10110c", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 150.09999999999997, 130, 395, 138.0, 146.8, 382.5999999999998, 395.0, 0.10671162783252677, 0.0865989870398728, 0.0379326489560935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/848092d8-f580-4d53-85a9-cbf4e8df2eae", 3, 0, 0.0, 381.6666666666667, 254, 446, 445.0, 446.0, 446.0, 446.0, 0.02165799143787405, 0.029857289628709833, 0.01388875101973043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 517.6666666666667, 261, 1780, 282.0, 1659.7000000000005, 1780.0, 1780.0, 0.06370711714677058, 12.78492137148151, 0.14056212240260774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a793f2a-2158-45b8-b01e-ad900a8d0c8f", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 360.6666666666667, 260, 820, 276.0, 805.6, 820.0, 820.0, 0.08361204013377926, 0.12958233173076922, 0.1880454379180602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1be9a6d4-1a7e-4dff-aa03-8f82d360c651", 3, 0, 0.0, 444.33333333333337, 239, 837, 257.0, 837.0, 837.0, 837.0, 0.018142673988243544, 0.025011140735745906, 0.01163446216042962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 163.72727272727272, 135, 381, 141.0, 335.00000000000017, 381.0, 381.0, 0.07626865982097666, 0.06323446502735271, 0.027111125170737795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 153.1578947368421, 130, 386, 139.0, 154.0, 386.0, 386.0, 0.11542153158297593, 0.08960948985201744, 0.041028747554885975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d4f6752-6e3b-42ed-9733-3f72bfe077d9", 3, 0, 0.0, 629.0, 252, 1194, 441.0, 1194.0, 1194.0, 1194.0, 0.016710578353116803, 0.02303688129083648, 0.01071609354024743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2ed34e6-96dd-4fa1-a876-dd362cf3fbc4", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 134.64285714285714, 127, 143, 133.0, 142.0, 143.0, 143.0, 0.10779180782260547, 0.08010699780566677, 0.05410643478595627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 229.14285714285717, 127, 448, 133.5, 431.5, 448.0, 448.0, 0.10780010780010779, 0.05197505197505197, 0.06018638831138831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 366.49999999999994, 128, 1384, 137.0, 1377.5, 1384.0, 1384.0, 0.10780508840017249, 13.882507012143472, 0.062054100828559104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 364.64285714285717, 127, 1106, 258.5, 1104.5, 1106.0, 1106.0, 0.10780176794899436, 4.553090686312256, 0.062157464694921], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.37257824143070045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14903129657228018], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.14903129657228018], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 0.9687034277198212], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 22, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
