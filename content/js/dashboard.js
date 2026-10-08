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

    var data = {"OkPercent": 98.87054735013032, "KoPercent": 1.1294526498696786};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6397168405365127, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1326530612244898, 500, 1500, "see books"], "isController": true}, {"data": [0.19230769230769232, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9be41316-188b-40f5-bc62-0d935d983ac3"], "isController": false}, {"data": [0.5, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=059d2126-c08e-4e13-920a-14e3f9aeead8"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e482f2b9-0073-4ca9-9835-aba2a9c41a1c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/137f3643-7d91-4e3b-8789-ee2371563f4c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/aa049e4e-e4fe-420c-9a43-8e5d18c028da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8d0616f1-4ef7-454c-afa6-c3a8dc3b17f5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e79929a9-df97-4c34-93b5-08e9b4a706eb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0e3ec45-7e90-4eff-bcc7-2f24f805eaf7"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9be41316-188b-40f5-bc62-0d935d983ac3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/79256626-a762-40c9-a7cd-307b1b5d8e40"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07475561-935d-40a0-aa3f-d51168830928"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/54ad4315-cdbd-4e59-88a8-76bb62c57aa6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/44868ea6-f53d-4ac0-9658-8965f333cc56"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44868ea6-f53d-4ac0-9658-8965f333cc56"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/8ecd5f07-bbe4-40e7-b009-b1ecef4dbf5e"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25510204081632654, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e482f2b9-0073-4ca9-9835-aba2a9c41a1c"], "isController": false}, {"data": [0.1509433962264151, 500, 1500, "addBook"], "isController": true}, {"data": [0.8673469387755102, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6224489795918368, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9183673469387755, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3673469387755102, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7290322580645161, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/613019da-25da-4207-89ad-a54f44a12a73"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa049e4e-e4fe-420c-9a43-8e5d18c028da"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/867010c7-f924-4bae-bfc3-cd5b27a9de14"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=137f3643-7d91-4e3b-8789-ee2371563f4c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0e3ec45-7e90-4eff-bcc7-2f24f805eaf7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5edbcd9-f0d5-49eb-aa19-1a68692f9710"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e79929a9-df97-4c34-93b5-08e9b4a706eb"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/059d2126-c08e-4e13-920a-14e3f9aeead8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07475561-935d-40a0-aa3f-d51168830928"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54ad4315-cdbd-4e59-88a8-76bb62c57aa6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79256626-a762-40c9-a7cd-307b1b5d8e40"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1151, 13, 1.1294526498696786, 953.8801042571673, 77, 27096, 285.0, 2219.3999999999996, 4057.1999999999844, 9192.120000000015, 4.5389478001285575, 635.1228913770343, 3.3064941385069186], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 49, 0, 0.0, 5564.224489795919, 1050, 39082, 2460.0, 11206.0, 25029.5, 39082.0, 0.20896502607798234, 251.45542541441176, 1.027479400686173], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 1771.0, 93, 4194, 1611.0, 3620.7999999999993, 4194.0, 4194.0, 0.06994060428682103, 0.01325046604652664, 0.0472803108456357], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 1771.0, 93, 4194, 1611.0, 3620.7999999999993, 4194.0, 4194.0, 0.06928197229786985, 0.013125686157994872, 0.04683507126716727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 290.1904761904762, 80, 1502, 84.0, 1149.6000000000004, 1475.1999999999996, 1502.0, 0.09943888060231551, 0.026607669223666454, 0.05671123659350806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 244.2857142857143, 80, 1397, 84.0, 864.2, 1344.4999999999993, 1397.0, 0.09962758260787058, 0.07403963902791945, 0.050008376426216285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 107.42857142857143, 79, 257, 83.0, 241.6, 255.49999999999997, 257.0, 0.09998428818328549, 0.026948890174401167, 0.05887746657668081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 219.57142857142858, 78, 1209, 83.0, 909.2000000000006, 1194.7999999999997, 1209.0, 0.09998666844420745, 0.026949531729102787, 0.05878122500333289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9be41316-188b-40f5-bc62-0d935d983ac3", 1, 0, 0.0, 1789.0, 1789, 1789, 1789.0, 1789.0, 1789.0, 1789.0, 0.5589714924538849, 0.10098606064840694, 0.38538464225824487], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 1143.3846153846155, 79, 4125, 918.0, 3371.7999999999993, 4125.0, 4125.0, 0.07071443335980591, 0.14782992532827816, 0.04571046417226036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=059d2126-c08e-4e13-920a-14e3f9aeead8", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 164.26666666666665, 81, 644, 83.0, 560.0, 644.0, 644.0, 0.08387572971884856, 0.06233342804301147, 0.0421016846440314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 953.0, 651, 1491, 717.0, 1491.0, 1491.0, 1491.0, 0.01851588971936083, 5.444286362892923, 0.010559843355572975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 443.2666666666667, 81, 4686, 84.0, 2063.4000000000015, 4686.0, 4686.0, 0.08387760579762012, 0.03924117677485014, 0.04689719261653395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 876.3333333333334, 788, 1033, 808.0, 1033.0, 1033.0, 1033.0, 0.01849796522382538, 16.64450162435257, 0.010531556372549019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 242.0, 83, 380, 263.0, 380.0, 380.0, 380.0, 0.01854691132103467, 0.03281933917354963, 0.01026962765529947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 109.22222222222223, 82, 319, 83.0, 319.0, 319.0, 319.0, 0.05027680172505293, 0.03736391221949735, 0.025236597740895712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e482f2b9-0073-4ca9-9835-aba2a9c41a1c", 1, 0, 0.0, 1344.0, 1344, 1344, 1344.0, 1344.0, 1344.0, 1344.0, 0.744047619047619, 0.13442266555059523, 0.5129859561011905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 374.1111111111111, 79, 2024, 82.0, 2024.0, 2024.0, 2024.0, 0.05012642999565571, 0.02177801928196674, 0.02811996995199002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 207.44444444444446, 80, 715, 152.0, 715.0, 715.0, 715.0, 0.050100200400801605, 5.020919660501559, 0.02897505079603652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 399.44444444444446, 80, 2330, 90.0, 2330.0, 2330.0, 2330.0, 0.049653802653719895, 1.6341036281757746, 0.028765370265647846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 89.0, 83, 93, 91.0, 93.0, 93.0, 93.0, 0.018580108136229352, 0.01380806864420951, 0.010433166189777224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 1023.7777777777775, 80, 5330, 572.5, 3251.9000000000033, 5330.0, 5330.0, 0.09405076651374708, 42.32619732667228, 0.05125032003385828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 401.93333333333334, 81, 2200, 85.0, 1591.6000000000004, 2200.0, 2200.0, 0.08387526071226871, 10.082407006799489, 0.04834840874651219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 1097.7777777777776, 79, 10831, 450.5, 3814.6000000000113, 10831.0, 10831.0, 0.0940546980321667, 13.840277405840798, 0.05134431269529413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 208.66666666666669, 80, 874, 97.0, 728.2, 874.0, 874.0, 0.08387760579762012, 3.307966764896663, 0.04843167225384719], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 1166.0, 123, 2172, 1308.0, 2057.1000000000004, 2172.0, 2172.0, 0.06460296096904442, 0.012286549461641993, 0.04415692294751009], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 762.8888888888889, 167, 2412, 363.0, 2412.0, 2412.0, 2412.0, 0.049630801978614636, 6.665670891258913, 0.11020989176349269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 1768.0526315789475, 121, 6356, 1365.0, 3612.0, 6356.0, 6356.0, 0.08175207607245816, 0.05021685141560174, 0.03696407345854309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 261.6111111111111, 81, 1182, 152.5, 830.1000000000006, 1182.0, 1182.0, 0.09359011688365708, 0.06955281147310843, 0.04697785163886693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 355.0555555555556, 78, 1966, 130.0, 1273.900000000001, 1966.0, 1966.0, 0.09413093613215984, 0.09587750623617451, 0.04973128559326022], "isController": false}, {"data": ["login", 19, 0, 0.0, 7118.421052631577, 2431, 12133, 6924.0, 10322.0, 12133.0, 12133.0, 0.08346915375457434, 15.883992050935953, 0.14779136912476004], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/137f3643-7d91-4e3b-8789-ee2371563f4c", 2, 0, 0.0, 1011.0, 700, 1322, 1011.0, 1322.0, 1322.0, 1322.0, 0.059092923622396216, 0.03390341076968533, 0.03673109949771015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 228.79999999999995, 84, 1062, 104.0, 714.6000000000001, 1062.0, 1062.0, 0.08553539454626324, 0.06924691609262912, 0.03040515978011701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa049e4e-e4fe-420c-9a43-8e5d18c028da", 3, 0, 0.0, 1498.0, 687, 2628, 1179.0, 2628.0, 2628.0, 2628.0, 0.01862474856589436, 0.025675719458516478, 0.011943605037373663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d0616f1-4ef7-454c-afa6-c3a8dc3b17f5", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.3556079482182628, 0.6644539949888641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e79929a9-df97-4c34-93b5-08e9b4a706eb", 1, 0, 0.0, 1772.0, 1772, 1772, 1772.0, 1772.0, 1772.0, 1772.0, 0.564334085778781, 0.10195488854401806, 0.38908189898419865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0e3ec45-7e90-4eff-bcc7-2f24f805eaf7", 1, 0, 0.0, 1593.0, 1593, 1593, 1593.0, 1593.0, 1593.0, 1593.0, 0.6277463904582549, 0.11341121311989956, 0.432801710608914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9be41316-188b-40f5-bc62-0d935d983ac3", 3, 0, 0.0, 1630.6666666666667, 422, 2242, 2228.0, 2242.0, 2242.0, 2242.0, 0.03128225983045015, 0.02607873288599702, 0.020060563758459247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79256626-a762-40c9-a7cd-307b1b5d8e40", 3, 0, 0.0, 1464.0, 1166, 1774, 1452.0, 1774.0, 1774.0, 1774.0, 0.06953780538686198, 0.03146404605720643, 0.04459292858467386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07475561-935d-40a0-aa3f-d51168830928", 3, 0, 0.0, 715.0, 460, 1224, 461.0, 1224.0, 1224.0, 1224.0, 0.028737559031735842, 0.023957320533943848, 0.01842870810303373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1959.0555555555557, 172, 10916, 980.0, 6201.8000000000075, 10916.0, 10916.0, 0.09347298890267904, 55.98552803637917, 0.19826497255529188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ad4315-cdbd-4e59-88a8-76bb62c57aa6", 3, 0, 0.0, 1543.3333333333335, 291, 3201, 1138.0, 3201.0, 3201.0, 3201.0, 0.019574451425998788, 0.026984961519890906, 0.01255262672826094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44868ea6-f53d-4ac0-9658-8965f333cc56", 3, 0, 0.0, 4125.333333333333, 2443, 5808, 4125.0, 5808.0, 5808.0, 5808.0, 0.01883830455259027, 0.022266238226059654, 0.012080553375196233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 666.9523809523811, 167, 2900, 319.0, 1881.4, 2803.9999999999986, 2900.0, 0.09904725969248183, 0.15350390735543815, 0.2227596084685407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 703.2, 79, 1583, 872.0, 1583.0, 1583.0, 1583.0, 0.030812463025044368, 22.12074865041412, 0.04985360228505226], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 2969.9523809523807, 285, 6807, 2839.0, 6403.200000000001, 6777.7, 6807.0, 0.08420883791803672, 0.026738185700537334, 0.03799265929505173], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 763.4666666666667, 166, 4999, 319.0, 2760.4000000000015, 4999.0, 4999.0, 0.08383588287568257, 13.485520276756223, 0.18568883927822893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 347.0, 90, 1835, 229.0, 1427.0000000000014, 1835.0, 1835.0, 0.08074935400516796, 0.0626911488614341, 0.028703871931524547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44868ea6-f53d-4ac0-9658-8965f333cc56", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ecd5f07-bbe4-40e7-b009-b1ecef4dbf5e", 2, 0, 0.0, 568.0, 465, 671, 568.0, 671.0, 671.0, 671.0, 0.014384349827387802, 0.028431566455696205, 0.008941053383918297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 1211.9411764705885, 160, 4278, 698.0, 3883.5999999999995, 4278.0, 4278.0, 0.09212544233760181, 19.567120073998407, 0.2030326628723629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 342.0, 81, 1455, 86.0, 1455.0, 1455.0, 1455.0, 0.037114932574539156, 0.027582484071508102, 0.018629956389954225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 841.6666666666666, 87, 4012, 173.0, 4012.0, 4012.0, 4012.0, 0.03713169995110993, 0.009935630650980586, 0.021176672628367383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 294.1666666666667, 78, 1183, 87.5, 1183.0, 1183.0, 1183.0, 0.037136066547831255, 0.010009330436720141, 0.021831945372846107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 142.0, 82, 254, 93.5, 254.0, 254.0, 254.0, 0.03713560685770873, 0.010009206535866807, 0.021867940366404656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 49, 0, 0.0, 3820.5306122448974, 644, 27096, 1465.0, 9618.0, 20408.0, 27096.0, 0.21191388511672563, 253.52267978622646, 0.4184471442441594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 2969.9523809523807, 285, 6807, 2839.0, 6403.200000000001, 6777.7, 6807.0, 0.08509569213189022, 0.0270197817092888, 0.03839278297356766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 285.25, 140, 391, 305.0, 391.0, 391.0, 391.0, 0.02164584156326268, 0.005834230733848143, 0.012746525842429095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 195.75, 79, 379, 162.5, 379.0, 379.0, 379.0, 0.021652520353369134, 0.005836030876494024, 0.012729313723367401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 98.75, 78, 181, 83.5, 164.80000000000007, 181.0, 181.0, 0.08384455220022079, 0.022598726960215757, 0.04929142619583292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 310.3333333333333, 83, 1073, 243.0, 959.0000000000005, 1073.0, 1073.0, 0.08328648468569763, 0.02244831032544194, 0.04904467799362859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 90.5, 81, 117, 82.0, 117.0, 117.0, 117.0, 0.02164841885360798, 0.005792643326063073, 0.012346363877448302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 162.25, 80, 843, 97.0, 632.1000000000008, 843.0, 843.0, 0.08386388890830183, 0.062324628378142274, 0.04209574111217494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 174.75, 82, 388, 114.5, 388.0, 388.0, 388.0, 0.021652520353369134, 0.01609137498917374, 0.01086855025549974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 533.1666666666667, 79, 4536, 161.5, 3299.1000000000045, 4536.0, 4536.0, 0.08377138788246875, 0.022415390898238706, 0.04777586965172045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 429.0, 88, 1277, 175.5, 1277.0, 1277.0, 1277.0, 0.021641040068385686, 0.017033865522577015, 0.007692713461808974], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 1620.6363636363637, 80, 3201, 1774.0, 3049.4000000000005, 3201.0, 3201.0, 0.061008751982784444, 0.011504136116071925, 0.041521048712715336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 3914.7368421052633, 1689, 6512, 4191.0, 6033.0, 6512.0, 6512.0, 0.08527789372579117, 0.04413797233854427, 0.03922449994614028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 461.0, 261, 779, 402.0, 779.0, 779.0, 779.0, 0.02163612367208291, 0.033531765886323804, 0.04866014923516303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e482f2b9-0073-4ca9-9835-aba2a9c41a1c", 3, 0, 0.0, 2572.0, 468, 5036, 2212.0, 5036.0, 5036.0, 5036.0, 0.028231839869004263, 0.02353572327621091, 0.01810440252016224], "isController": false}, {"data": ["addBook", 53, 5, 9.433962264150944, 2927.735849056604, 575, 13661, 2030.0, 5640.400000000001, 9488.899999999996, 13661.0, 0.2594490867881672, 88.83140042998791, 0.9421378818919224], "isController": true}, {"data": ["https://demoqa.com/books-0", 49, 0, 0.0, 424.1224489795918, 80, 1964, 253.0, 1408.0, 1744.0, 1964.0, 0.2126523827916484, 0.1580356086957465, 0.10279582957213472], "isController": false}, {"data": ["https://demoqa.com/books-3", 49, 0, 0.0, 1840.7551020408168, 398, 24232, 628.0, 6430.0, 8633.0, 24232.0, 0.21366030627550842, 62.823224234856276, 0.10745611106629574], "isController": false}, {"data": ["https://demoqa.com/books-1", 49, 0, 0.0, 298.79591836734687, 78, 2484, 147.0, 516.0, 1774.5, 2484.0, 0.21395885003667867, 0.37860687135396653, 0.10405420636549412], "isController": false}, {"data": ["https://demoqa.com/books-2", 49, 0, 0.0, 2472.1632653061233, 547, 25594, 869.0, 5559.0, 15017.0, 25594.0, 0.21329943758597275, 191.9272088802759, 0.10706631925702148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 549.5882352941176, 82, 4817, 181.0, 1685.7999999999972, 4817.0, 4817.0, 0.10037670788016201, 0.07498845852375385, 0.03568078287927635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 5, 3.225806451612903, 598.5419354838712, 82, 4466, 285.0, 1456.8000000000006, 2782.1999999999985, 4379.759999999999, 0.6600660066006601, 1.3985065341211542, 0.31860078648993934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 273.33333333333337, 84, 574, 257.0, 574.0, 574.0, 574.0, 0.0381378556355038, 0.029534491717729015, 0.013556815870432991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/613019da-25da-4207-89ad-a54f44a12a73", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.5068824404761905, 0.9471106150793651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 415.8571428571429, 82, 3659, 110.0, 1437.6000000000006, 3454.799999999997, 3659.0, 0.09868467427008586, 0.08008492609222788, 0.03507931780694458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa049e4e-e4fe-420c-9a43-8e5d18c028da", 1, 0, 0.0, 1341.0, 1341, 1341, 1341.0, 1341.0, 1341.0, 1341.0, 0.7457121551081282, 0.1347233873974646, 0.5141335756897838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 1185.6666666666665, 174, 4274, 258.5, 4274.0, 4274.0, 4274.0, 0.03709244674142856, 0.05748604783071007, 0.08342178207569331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/867010c7-f924-4bae-bfc3-cd5b27a9de14", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.35799992993273544, 0.6689234164798206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 844.6666666666666, 180, 4628, 361.0, 3700.7000000000035, 4628.0, 4628.0, 0.08323853389195637, 0.12900347000638163, 0.187205413626148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=137f3643-7d91-4e3b-8789-ee2371563f4c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0e3ec45-7e90-4eff-bcc7-2f24f805eaf7", 3, 0, 0.0, 476.3333333333333, 268, 651, 510.0, 651.0, 651.0, 651.0, 0.04665847551207677, 0.029024852442571195, 0.02992096248658569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5edbcd9-f0d5-49eb-aa19-1a68692f9710", 1, 0, 0.0, 2009.0, 2009, 2009, 2009.0, 2009.0, 2009.0, 2009.0, 0.49776007964161273, 0.15895268168242907, 0.2970033287705326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e79929a9-df97-4c34-93b5-08e9b4a706eb", 3, 0, 0.0, 1200.6666666666667, 622, 2062, 918.0, 2062.0, 2062.0, 2062.0, 0.019715570042848508, 0.023303136336452777, 0.012643122716279804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 351.1111111111111, 91, 1426, 113.0, 1426.0, 1426.0, 1426.0, 0.04851647403829567, 0.04022508443214163, 0.017246090380800414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/059d2126-c08e-4e13-920a-14e3f9aeead8", 3, 0, 0.0, 1063.0, 619, 1406, 1164.0, 1406.0, 1406.0, 1406.0, 0.06164088023176972, 0.02789089307361976, 0.03952881967987836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 464.72222222222223, 84, 1910, 253.0, 1560.8000000000006, 1910.0, 1910.0, 0.09069106592232815, 0.07040956778149499, 0.03223783983957758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07475561-935d-40a0-aa3f-d51168830928", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54ad4315-cdbd-4e59-88a8-76bb62c57aa6", 1, 0, 0.0, 2172.0, 2172, 2172, 2172.0, 2172.0, 2172.0, 2172.0, 0.4604051565377532, 0.08317866597605893, 0.31742777394106814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79256626-a762-40c9-a7cd-307b1b5d8e40", 1, 0, 0.0, 1275.0, 1275, 1275, 1275.0, 1275.0, 1275.0, 1275.0, 0.7843137254901961, 0.14169730392156862, 0.5407475490196079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 287.41176470588243, 79, 2060, 84.0, 1173.5999999999992, 2060.0, 2060.0, 0.09271328145025387, 0.06890117889027657, 0.046537721352959464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 596.9411764705882, 78, 3704, 137.0, 3596.0, 3704.0, 3704.0, 0.09334197204133401, 0.04971661102753039, 0.05185069333867762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 490.1176470588235, 77, 2217, 141.0, 1579.3999999999994, 2217.0, 2217.0, 0.09316599989039294, 14.814373381583273, 0.05335851441332822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 279.4117647058824, 79, 866, 231.0, 765.9999999999999, 866.0, 866.0, 0.09372226234515152, 4.883883888453968, 0.053768625576805396], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.3475238922675934], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.08688097306689835], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.08688097306689835], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.6081668114682884], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1151, 13, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 155, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
