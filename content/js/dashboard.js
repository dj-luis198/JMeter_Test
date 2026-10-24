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

    var data = {"OkPercent": 99.08814589665654, "KoPercent": 0.9118541033434651};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7488539620170268, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13578723-b985-4d5d-bd83-e64e3b95e2b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=377b3a1d-e5ed-4e3c-8511-04267530dcf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55b85552-973f-4ede-b73a-370ef0e3ca2e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a544bac7-20fd-4688-8f93-c74d14dfeea6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2ec5cb9-c971-410a-9f5e-15efbfcf6eb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f65a86b-6c7a-4721-9755-0133a66e581c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2f1cee0-7b33-4de6-b4dc-c50e8055c94e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98e871c1-92c1-47cd-9650-974657af774e"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ab4b6bf-4ef3-4d8c-a162-425402d00db0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c42ec2c7-9bc6-43bd-a5a8-ef2b549bd1ab"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ce15fcf-aea3-4b0e-9eec-0a890c22f03a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13578723-b985-4d5d-bd83-e64e3b95e2b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6153cdf-aa63-4281-be53-2aa825dd4ce9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c5f15d6-dde7-42c7-bc80-e4ef7409792a"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bc558dd-d2b3-490e-9e0d-d56a03522c4a"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f65a86b-6c7a-4721-9755-0133a66e581c"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/377b3a1d-e5ed-4e3c-8511-04267530dcf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a544bac7-20fd-4688-8f93-c74d14dfeea6"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55b85552-973f-4ede-b73a-370ef0e3ca2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70a89343-20f4-46a3-aff1-82a434a8ed13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/834912ed-cc35-411f-9451-f3c222655a08"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2f1cee0-7b33-4de6-b4dc-c50e8055c94e"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9410112359550562, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ce15fcf-aea3-4b0e-9eec-0a890c22f03a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2ec5cb9-c971-410a-9f5e-15efbfcf6eb3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c42ec2c7-9bc6-43bd-a5a8-ef2b549bd1ab"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c5f15d6-dde7-42c7-bc80-e4ef7409792a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98e871c1-92c1-47cd-9650-974657af774e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b6153cdf-aa63-4281-be53-2aa825dd4ce9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 12, 0.9118541033434651, 445.83358662613927, 125, 3230, 161.0, 1237.8999999999999, 1514.4499999999996, 2110.2199999999975, 5.23739403828551, 736.6362550120388, 3.8297907567059335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2208.7321428571418, 1636, 2922, 2079.0, 2748.1, 2887.9, 2922.0, 0.246445247347413, 296.55572653764233, 1.2117693558537348], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 900.1538461538462, 509, 3230, 752.0, 2396.7999999999993, 3230.0, 3230.0, 0.07155044306235897, 0.012926593717320712, 0.048631941768947105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 900.1538461538462, 509, 3230, 752.0, 2396.7999999999993, 3230.0, 3230.0, 0.0734982332155477, 0.013278489399293287, 0.04995583038869258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 255.60000000000002, 128, 470, 157.0, 419.0, 470.0, 470.0, 0.12952584904194048, 0.060597184323918245, 0.07241979111798078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 170.20000000000002, 128, 413, 130.0, 396.2, 413.0, 413.0, 0.12949006811177582, 0.09623236507134902, 0.06499794434516873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 279.5333333333333, 128, 889, 156.0, 812.8000000000001, 889.0, 889.0, 0.12952584904194048, 5.1082431329712366, 0.07478937208027149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 355.8666666666666, 127, 1625, 130.0, 1558.4, 1625.0, 1625.0, 0.12952696751463655, 15.570069097240212, 0.07466352671709583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13578723-b985-4d5d-bd83-e64e3b95e2b0", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=377b3a1d-e5ed-4e3c-8511-04267530dcf0", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55b85552-973f-4ede-b73a-370ef0e3ca2e", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 286.7142857142857, 127, 483, 253.0, 462.0, 483.0, 483.0, 0.07497375918428549, 0.16754041219501745, 0.04846413409324594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a544bac7-20fd-4688-8f93-c74d14dfeea6", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2ec5cb9-c971-410a-9f5e-15efbfcf6eb3", 3, 0, 0.0, 452.6666666666667, 282, 635, 441.0, 635.0, 635.0, 635.0, 0.01974892532931333, 0.023342561155838767, 0.012664512662352623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 136.75, 126, 162, 131.0, 160.6, 162.0, 162.0, 0.10895397375571157, 0.08097067776181299, 0.05468978760784741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 152.4375, 126, 434, 128.5, 243.6000000000002, 434.0, 434.0, 0.1089621356578589, 0.03938438521520022, 0.06157052318850449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 957.8, 766, 1010, 1004.0, 1010.0, 1010.0, 1010.0, 0.103260981805415, 30.36215723807852, 0.058891028685900744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1360.8, 1139, 1514, 1379.0, 1514.0, 1514.0, 1514.0, 0.10219932957239801, 91.95913639650274, 0.05818575111397269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 229.6, 126, 385, 128.0, 385.0, 385.0, 385.0, 0.10407993338884264, 0.18417269462947544, 0.057630197491673606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 130.92307692307693, 127, 142, 129.0, 141.6, 142.0, 142.0, 0.07818044045657377, 0.05810089373774672, 0.03924291640105363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 168.84615384615387, 126, 381, 129.0, 379.4, 381.0, 381.0, 0.078187493609676, 0.029954643735678157, 0.04408618742745103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 278.61538461538464, 126, 1523, 133.0, 1070.9999999999995, 1523.0, 1523.0, 0.07818796386513178, 5.431273578557853, 0.04544910339456053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 202.76923076923077, 125, 746, 128.0, 634.8, 746.0, 746.0, 0.07818702335987682, 1.7878820826917987, 0.04552491121262059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 127.8, 125, 131, 127.0, 131.0, 131.0, 131.0, 0.10464410539754296, 0.0777677384839162, 0.058760117776940624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 820.0000000000001, 127, 1883, 704.5, 1570.9, 1867.4999999999998, 1883.0, 0.09794079478954971, 44.076848709017895, 0.05337008153571166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 224.75, 126, 1365, 129.5, 697.9000000000007, 1365.0, 1365.0, 0.1089621356578589, 6.155303231833969, 0.06347257218741487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 552.2500000000001, 126, 1404, 448.5, 1043.9, 1385.9999999999998, 1404.0, 0.09794127441186265, 14.412192433791699, 0.05346598866819455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 199.50000000000003, 127, 636, 131.0, 460.3000000000002, 636.0, 636.0, 0.10894062055300982, 2.029537696008007, 0.0635664265433822], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 816.25, 235, 2167, 636.0, 1951.9000000000008, 2167.0, 2167.0, 0.07830342577487764, 0.014146615008156607, 0.05398654159869494], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 438.07692307692304, 254, 1653, 286.0, 1232.5999999999997, 1653.0, 1653.0, 0.0781198358281604, 7.300871411745618, 0.17415582691348527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f65a86b-6c7a-4721-9755-0133a66e581c", 1, 0, 0.0, 2167.0, 2167, 2167, 2167.0, 2167.0, 2167.0, 2167.0, 0.46146746654360865, 0.08337058721735119, 0.31816018689432396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2f1cee0-7b33-4de6-b4dc-c50e8055c94e", 3, 0, 0.0, 389.3333333333333, 271, 614, 283.0, 614.0, 614.0, 614.0, 0.04351042074576861, 0.02757642877344124, 0.027902190387097712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98e871c1-92c1-47cd-9650-974657af774e", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 0.2289785329531052, 0.8738315906210392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 474.2857142857143, 167, 949, 473.0, 823.2000000000002, 940.6999999999998, 949.0, 0.09503767564998981, 0.05837763474984726, 0.04297113654877469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 135.7, 127, 160, 130.0, 159.0, 159.95, 160.0, 0.09794031517193422, 0.07278572250570503, 0.049161447264037296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 227.29999999999998, 127, 473, 132.0, 416.9, 470.19999999999993, 473.0, 0.09794175403887308, 0.09975903267826623, 0.051744618100615564], "isController": false}, {"data": ["login", 21, 0, 0.0, 2390.0952380952385, 1353, 3785, 2255.0, 3355.0, 3748.8999999999996, 3785.0, 0.09752427657884838, 27.91338084594183, 0.18564714758906056], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 172.12499999999997, 129, 392, 140.5, 388.5, 392.0, 392.0, 0.10703629868479148, 0.08665340977508998, 0.03804805929810947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ab4b6bf-4ef3-4d8c-a162-425402d00db0", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.7443728146853147, 1.3908617424242424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c42ec2c7-9bc6-43bd-a5a8-ef2b549bd1ab", 3, 0, 0.0, 392.0, 255, 591, 330.0, 591.0, 591.0, 591.0, 0.02327475852438031, 0.02750997662826331, 0.014925545017262112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ce15fcf-aea3-4b0e-9eec-0a890c22f03a", 3, 0, 0.0, 477.0, 411, 607, 413.0, 607.0, 607.0, 607.0, 0.02270817721461498, 0.026840296701258794, 0.014562209997653489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13578723-b985-4d5d-bd83-e64e3b95e2b0", 3, 0, 0.0, 368.0, 264, 559, 281.0, 559.0, 559.0, 559.0, 0.025532566788939292, 0.025607369230703763, 0.016373423364000782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6153cdf-aa63-4281-be53-2aa825dd4ce9", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 966.4999999999999, 258, 2014, 912.0, 1701.0, 1998.4499999999998, 2014.0, 0.09787800485474904, 58.623906748566085, 0.20760842435987784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c5f15d6-dde7-42c7-bc80-e4ef7409792a", 1, 0, 0.0, 1243.0, 1243, 1243, 1243.0, 1243.0, 1243.0, 1243.0, 0.8045052292839903, 0.14534518302493965, 0.5546686444086886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 615.6666666666666, 259, 1754, 514.0, 1688.0, 1754.0, 1754.0, 0.12934602649006624, 20.806108352627447, 0.2864896593241239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1262.3333333333335, 127, 1642, 1452.5, 1642.0, 1642.0, 1642.0, 0.09608455440787894, 95.79639457722796, 0.19088673032268397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bc558dd-d2b3-490e-9e0d-d56a03522c4a", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 897.9090909090909, 195, 1763, 863.0, 1536.6999999999998, 1738.5499999999997, 1763.0, 0.0910110081951276, 0.028634855561393127, 0.04106160721303608], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 403.8125, 258, 1496, 285.0, 831.0000000000007, 1496.0, 1496.0, 0.10883539326989136, 8.295941980957208, 0.24303294056227084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 141.30769230769232, 129, 167, 130.0, 166.2, 167.0, 167.0, 0.08744963237519927, 0.0678930251350424, 0.031085611508371618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f65a86b-6c7a-4721-9755-0133a66e581c", 3, 0, 0.0, 344.3333333333333, 226, 565, 242.0, 565.0, 565.0, 565.0, 0.04279234302342168, 0.028012826113314127, 0.027441704347702052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 417.0625, 257, 886, 300.5, 715.2000000000002, 886.0, 886.0, 0.07239753486393788, 0.1122020388955756, 0.16282375272621966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 165.0, 127, 410, 130.0, 390.40000000000003, 410.0, 410.0, 0.07756409945656652, 0.05764285125629602, 0.03893354211003437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 200.6875, 126, 475, 128.5, 412.70000000000005, 475.0, 475.0, 0.07747171072063218, 0.020729735095169156, 0.04418308502036054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 167.9375, 126, 472, 128.5, 409.70000000000005, 472.0, 472.0, 0.07756635559326143, 0.020906556780996243, 0.045600533268694704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 179.0625, 126, 392, 129.5, 385.0, 392.0, 392.0, 0.07756597956136439, 0.020906455428648992, 0.04567606022998313], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1530.303571428572, 1032, 2397, 1384.5, 2121.1, 2258.4, 2397.0, 0.2332808451431761, 279.08499233505796, 0.4606385438276388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 897.9090909090909, 195, 1763, 863.0, 1536.6999999999998, 1738.5499999999997, 1763.0, 0.09089181395271972, 0.02859735339563554, 0.04100783012319972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 191.75, 127, 383, 128.0, 383.0, 383.0, 383.0, 0.04892158481474007, 0.013185895907097912, 0.028808316057898697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/377b3a1d-e5ed-4e3c-8511-04267530dcf0", 3, 0, 0.0, 988.0, 266, 1700, 998.0, 1700.0, 1700.0, 1700.0, 0.03990953837967274, 0.02565798772781695, 0.02559303079686045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 175.0, 128, 470, 129.0, 470.0, 470.0, 470.0, 0.04892098649169261, 0.013185734640339022, 0.028760189324217724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a544bac7-20fd-4688-8f93-c74d14dfeea6", 3, 0, 0.0, 338.6666666666667, 234, 491, 291.0, 491.0, 491.0, 491.0, 0.05063120232228448, 0.03255098456592182, 0.03246857701005873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 298.61538461538464, 127, 1123, 128.0, 1092.2, 1123.0, 1123.0, 0.08788118463836891, 12.185526370270471, 0.05050263390050498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 327.53846153846155, 125, 1038, 131.0, 1030.4, 1038.0, 1038.0, 0.0878972278566599, 3.996154496281271, 0.05059769058485463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55b85552-973f-4ede-b73a-370ef0e3ca2e", 3, 0, 0.0, 323.0, 235, 466, 268.0, 466.0, 466.0, 466.0, 0.08962715105162525, 0.04055395181046845, 0.057475744652246655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 172.15384615384616, 127, 381, 129.0, 380.2, 381.0, 381.0, 0.08842875703178674, 0.06571707431756807, 0.04438709093197108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 169.875, 128, 378, 142.0, 378.0, 378.0, 378.0, 0.04891291056274303, 0.013088024896671475, 0.027895644305314386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 174.30769230769232, 127, 393, 130.0, 392.2, 393.0, 393.0, 0.08827144147263924, 0.044016363318462995, 0.04920178002756785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 210.25, 129, 689, 144.5, 689.0, 689.0, 689.0, 0.04891919161035864, 0.03635498517137004, 0.024555141101293303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70a89343-20f4-46a3-aff1-82a434a8ed13", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 176.75, 130, 378, 158.5, 378.0, 378.0, 378.0, 0.047988386810391886, 0.0377721091495858, 0.01705837187400649], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 854.9166666666665, 466, 2964, 587.0, 2584.800000000001, 2964.0, 2964.0, 0.0761788679820218, 0.013762783766283234, 0.05185221775729413], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1305.8095238095236, 905, 2726, 1122.0, 2547.6000000000004, 2716.2, 2726.0, 0.09602897331309103, 0.049702495953064696, 0.04416957659225183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 456.49999999999994, 260, 1159, 313.5, 1159.0, 1159.0, 1159.0, 0.048872570880500454, 0.0757429394407756, 0.10991555736112553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/834912ed-cc35-411f-9451-f3c222655a08", 2, 0, 0.0, 235.0, 227, 243, 235.0, 243.0, 243.0, 243.0, 0.014532982604019824, 0.024581177607580405, 0.009033440847127556], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1389.2786885245898, 646, 3909, 1069.0, 2366.4000000000005, 2853.8, 3909.0, 0.2911833500405747, 92.4966818598143, 1.0589379639242922], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2f1cee0-7b33-4de6-b4dc-c50e8055c94e", 1, 0, 0.0, 1450.0, 1450, 1450, 1450.0, 1450.0, 1450.0, 1450.0, 0.689655172413793, 0.1245959051724138, 0.4754849137931035], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 252.41071428571433, 127, 715, 157.0, 515.1, 618.9499999999999, 715.0, 0.2350985314738159, 0.17471677973786512, 0.11364626277298717], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 848.3571428571429, 624, 1421, 765.5, 1024.0, 1182.9499999999998, 1421.0, 0.2348402247756437, 69.05082351337751, 0.11810812085884424], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 200.76785714285717, 127, 522, 135.0, 384.6, 466.8499999999999, 522.0, 0.23570610815543133, 0.41708932419691563, 0.11463050963027813], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1275.5178571428573, 874, 1855, 1212.5, 1659.6000000000001, 1728.15, 1855.0, 0.2340061008733442, 210.5591009046843, 0.11746009360244035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 141.3125, 130, 161, 133.5, 161.0, 161.0, 161.0, 0.07553690213722222, 0.05643137708493652, 0.02685100818159071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 227.3089887640449, 128, 2733, 140.0, 333.9999999999999, 513.5499999999998, 1624.630000000011, 0.7267026479738061, 1.5434577050383356, 0.3510158144581166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 143.1875, 129, 167, 132.5, 163.5, 167.0, 167.0, 0.0767485477735726, 0.05943515467230768, 0.02728171034138713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ce15fcf-aea3-4b0e-9eec-0a890c22f03a", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 134.66666666666669, 129, 157, 131.0, 152.2, 157.0, 157.0, 0.11993859144118212, 0.0973329780152562, 0.042634421176357705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2ec5cb9-c971-410a-9f5e-15efbfcf6eb3", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 0.2577233416547789, 0.9835279957203995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 408.875, 257, 885, 289.5, 803.8000000000001, 885.0, 885.0, 0.07742147768567847, 0.11998816903044116, 0.17412271788097416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c42ec2c7-9bc6-43bd-a5a8-ef2b549bd1ab", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 516.7692307692307, 255, 1255, 319.0, 1223.0, 1255.0, 1255.0, 0.08780402142418123, 16.275780031086, 0.19401707408295454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c5f15d6-dde7-42c7-bc80-e4ef7409792a", 3, 0, 0.0, 369.3333333333333, 230, 484, 394.0, 484.0, 484.0, 484.0, 0.020381819417079967, 0.024090620541477002, 0.013070372477749847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 156.0769230769231, 129, 382, 132.0, 293.5999999999999, 382.0, 382.0, 0.07482660373557429, 0.06203885407373298, 0.026598519296629923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98e871c1-92c1-47cd-9650-974657af774e", 3, 0, 0.0, 432.0, 230, 583, 483.0, 583.0, 583.0, 583.0, 0.01763626957625923, 0.020845473577928795, 0.011309717143629779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 168.24999999999997, 128, 430, 133.5, 368.80000000000047, 428.0, 430.0, 0.09501323059236, 0.07376515461027948, 0.03377423431212796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6153cdf-aa63-4281-be53-2aa825dd4ce9", 3, 0, 0.0, 1150.6666666666665, 241, 2964, 247.0, 2964.0, 2964.0, 2964.0, 0.019670325347181244, 0.02711713146006268, 0.012614108376935888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 149.93750000000003, 128, 412, 130.0, 234.2000000000002, 412.0, 412.0, 0.0724490026941973, 0.0538414951662931, 0.03636600330548575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 183.1875, 126, 470, 129.5, 413.30000000000007, 470.0, 470.0, 0.0724490026941973, 0.019385768299033258, 0.04131857184903439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 197.74999999999994, 126, 473, 129.0, 412.1000000000001, 473.0, 473.0, 0.07244933074930719, 0.019527358678524207, 0.042592282335041934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 260.125, 127, 511, 157.0, 483.0, 511.0, 511.0, 0.07244014632909558, 0.019524883190264044, 0.04265762523090296], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 50.0, 0.45592705167173253], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07598784194528875], "isController": false}, {"data": ["401/Unauthorized", 5, 41.666666666666664, 0.3799392097264438], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 12, "406/Not Acceptable", 6, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
