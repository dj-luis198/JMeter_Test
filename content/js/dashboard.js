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

    var data = {"OkPercent": 98.06351665375678, "KoPercent": 1.9364833462432223};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7916666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36363636363636365, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eb8197b-4976-467e-bac3-cc1bb5d70f5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b99e5d6-a3d5-4682-b059-0a6459c81787"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcd1ab4a-784b-4c6d-ab67-9f3a104234f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa678f4c-ca4a-4753-99c9-1ba15dbfe818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3d81f91-52cb-4b33-a9c1-1435f46530ba"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64637d4b-fff4-4ef3-8da2-347d99bd3b77"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d9a0a99-3d19-48c1-97e1-a503552d4862"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5e251c7-0e13-4460-b844-bc5455edf0a1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72a175e8-26cc-4311-95ba-4b856b798be1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac73081d-062a-421b-8a96-caa1743ab33b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44424c3a-1315-480d-825d-9aadf6acd6ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96c15825-d666-4a83-9f4c-01725d718def"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ba9d696-beda-4228-9715-14a7a3390c39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f6f6080-dd50-47b2-b3fe-ca51590d207e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/571b2c2b-031a-411d-b213-584e2c395370"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/71c67499-d8b7-4396-b0d4-40016514c52d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ac7355b-a403-45aa-9d30-bfb1af7225be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22252f96-063c-4ee5-8b27-9ccba608f5cd"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b99e5d6-a3d5-4682-b059-0a6459c81787"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9eb8197b-4976-467e-bac3-cc1bb5d70f5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcd1ab4a-784b-4c6d-ab67-9f3a104234f2"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e3d81f91-52cb-4b33-a9c1-1435f46530ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d9a0a99-3d19-48c1-97e1-a503552d4862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64637d4b-fff4-4ef3-8da2-347d99bd3b77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac73081d-062a-421b-8a96-caa1743ab33b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5e251c7-0e13-4460-b844-bc5455edf0a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22252f96-063c-4ee5-8b27-9ccba608f5cd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44424c3a-1315-480d-825d-9aadf6acd6ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ba9d696-beda-4228-9715-14a7a3390c39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ac7355b-a403-45aa-9d30-bfb1af7225be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1291, 25, 1.9364833462432223, 330.1154144074361, 76, 3975, 99.0, 923.0, 1120.9999999999973, 1837.2799999999988, 4.988581519450058, 715.1345063137338, 3.6307728171574745], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1378.8181818181815, 967, 1883, 1342.0, 1689.6, 1809.1999999999998, 1883.0, 0.23864070255822833, 287.1647132026884, 1.1733944700983199], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eb8197b-4976-467e-bac3-cc1bb5d70f5e", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b99e5d6-a3d5-4682-b059-0a6459c81787", 3, 0, 0.0, 622.6666666666667, 263, 1236, 369.0, 1236.0, 1236.0, 1236.0, 0.02629065192053212, 0.026367675314830558, 0.01685956519643499], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 626.6875000000001, 81, 1315, 670.0, 1088.2000000000003, 1315.0, 1315.0, 0.08996952282414332, 0.018181707157637853, 0.06034393837368841], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 626.6875000000001, 81, 1315, 670.0, 1088.2000000000003, 1315.0, 1315.0, 0.08897737194209797, 0.017981205963152246, 0.059678487565412275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcd1ab4a-784b-4c6d-ab67-9f3a104234f2", 3, 0, 0.0, 675.0, 266, 1463, 296.0, 1463.0, 1463.0, 1463.0, 0.036950818460628906, 0.030804376978408408, 0.0236956745987757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 98.17647058823529, 78, 238, 80.0, 234.8, 238.0, 238.0, 0.09072811984650937, 0.04030855232610889, 0.050846940327581885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 91.88235294117646, 77, 253, 81.0, 131.3999999999999, 253.0, 253.0, 0.09072811984650937, 0.06742587812811879, 0.0455412632823299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa678f4c-ca4a-4753-99c9-1ba15dbfe818", 2, 0, 0.0, 305.0, 179, 431, 305.0, 431.0, 431.0, 431.0, 0.06019925954910754, 0.037007259654456254, 0.03741877803028023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 191.11764705882354, 78, 636, 82.0, 623.2, 636.0, 636.0, 0.09065216232069535, 3.157411480829734, 0.052465563843118436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 198.11764705882354, 77, 846, 81.0, 725.1999999999999, 846.0, 846.0, 0.09065119552929633, 9.617806477694472, 0.0523764777477977], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 207.12499999999997, 79, 369, 185.5, 341.0, 369.0, 369.0, 0.09015049498256152, 0.1430996046759935, 0.05826437935610009], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 89.94444444444446, 79, 239, 80.5, 102.20000000000022, 239.0, 239.0, 0.09670816163157414, 0.07187003027502727, 0.048542963943973734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 613.0, 477, 704, 629.0, 704.0, 704.0, 704.0, 0.02545552664939085, 7.48477003795419, 0.01451760504223072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 106.38888888888889, 78, 236, 81.0, 233.3, 236.0, 236.0, 0.09670764205278087, 0.03394631315546291, 0.054702358726252905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 894.2, 693, 1218, 860.0, 1218.0, 1218.0, 1218.0, 0.02538109717406864, 22.83795585243684, 0.01445037075437697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 143.6, 80, 237, 87.0, 237.0, 237.0, 237.0, 0.02552869936382481, 0.04517383129614312, 0.01413552005789909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 82.88888888888889, 78, 90, 83.0, 90.0, 90.0, 90.0, 0.09503896597605019, 0.07062954405056074, 0.04770510596844706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 118.33333333333333, 78, 245, 82.0, 245.0, 245.0, 245.0, 0.09504599169931673, 0.057155478081338244, 0.052432055316767166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3d81f91-52cb-4b33-a9c1-1435f46530ba", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 287.77777777777777, 80, 852, 98.0, 852.0, 852.0, 852.0, 0.09504498796096819, 19.024735293108183, 0.054060962119292025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 201.44444444444446, 79, 620, 83.0, 620.0, 620.0, 620.0, 0.09504498796096819, 6.230231962573396, 0.05415377949034766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.4, 79, 87, 83.0, 87.0, 87.0, 87.0, 0.025527917330392516, 0.01897143075041866, 0.014334523891577829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64637d4b-fff4-4ef3-8da2-347d99bd3b77", 1, 0, 0.0, 981.0, 981, 981, 981.0, 981.0, 981.0, 981.0, 1.0193679918450562, 0.1841631625891947, 0.7028064475025484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 540.1666666666666, 78, 1054, 561.5, 1024.3, 1054.0, 1054.0, 0.09064767765685826, 40.79468603956519, 0.04939590247317081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 137.66666666666666, 78, 794, 80.0, 296.3000000000008, 794.0, 794.0, 0.09670868121595048, 4.858986864073262, 0.056392410248971125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 393.1111111111111, 79, 778, 428.5, 729.4000000000001, 778.0, 778.0, 0.0906472211590758, 13.338862525305682, 0.04948417639445642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 127.83333333333331, 78, 465, 80.5, 263.4000000000003, 465.0, 465.0, 0.09670972040145279, 1.6043886568900303, 0.056487459301326], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 525.6666666666667, 80, 981, 530.0, 922.2, 981.0, 981.0, 0.08378952072394145, 0.017052476678583398, 0.05657429162942688], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d9a0a99-3d19-48c1-97e1-a503552d4862", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 372.6666666666667, 162, 942, 187.0, 942.0, 942.0, 942.0, 0.094958745700479, 25.359724253650636, 0.20816531460359997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 625.8695652173911, 121, 1560, 547.0, 1287.6000000000001, 1517.9999999999993, 1560.0, 0.10219860298953132, 0.06277629031290546, 0.04620893865639941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 99.38888888888889, 79, 244, 80.0, 239.5, 244.0, 244.0, 0.09064585169331486, 0.06736473939317639, 0.04549996852574594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 89.27777777777777, 78, 236, 80.0, 100.10000000000022, 236.0, 236.0, 0.09064859066621679, 0.09233054693834386, 0.04789149174846023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5e251c7-0e13-4460-b844-bc5455edf0a1", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["login", 23, 0, 0.0, 3133.695652173913, 1689, 5187, 3057.0, 4542.000000000001, 5110.799999999999, 5187.0, 0.09928814715366784, 25.95961370300541, 0.1855961565234471], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/72a175e8-26cc-4311-95ba-4b856b798be1", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.7621382756563246, 1.4240565334128878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 116.6111111111111, 81, 274, 87.0, 250.60000000000002, 274.0, 274.0, 0.09786757429780016, 0.07923068270788704, 0.034788864301171146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac73081d-062a-421b-8a96-caa1743ab33b", 3, 0, 0.0, 459.0, 180, 911, 286.0, 911.0, 911.0, 911.0, 0.08559445347941454, 0.038729261177209054, 0.0548896723159006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44424c3a-1315-480d-825d-9aadf6acd6ad", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96c15825-d666-4a83-9f4c-01725d718def", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ba9d696-beda-4228-9715-14a7a3390c39", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f6f6080-dd50-47b2-b3fe-ca51590d207e", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.6737045094936709, 1.2588179061181435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/571b2c2b-031a-411d-b213-584e2c395370", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 650.2777777777777, 161, 1138, 730.0, 1106.5, 1138.0, 1138.0, 0.09060889175257732, 54.27008068438658, 0.19218995399081829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71c67499-d8b7-4396-b0d4-40016514c52d", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.3596125422297297, 0.6719365850225225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ac7355b-a403-45aa-9d30-bfb1af7225be", 3, 0, 0.0, 1067.3333333333333, 181, 2593, 428.0, 2593.0, 2593.0, 2593.0, 0.028153681563092402, 0.02823616305204677, 0.018054281471123704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22252f96-063c-4ee5-8b27-9ccba608f5cd", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 488.1818181818182, 78, 1305, 80.0, 1262.2000000000003, 1305.0, 1305.0, 0.055814331090612034, 30.35966628104038, 0.07737895901198485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 328.7647058823529, 161, 925, 313.0, 805.7999999999998, 925.0, 925.0, 0.09061157482917052, 12.877196706069377, 0.2010600471579946], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1206.7083333333335, 400, 2228, 1163.0, 1867.5, 2151.75, 2228.0, 0.10564449746233112, 0.03347816350246724, 0.04766382600351268], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 97.26666666666667, 81, 234, 86.0, 154.80000000000004, 234.0, 234.0, 0.08150224946208515, 0.06327567218980243, 0.02897150273847558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 255.38888888888889, 161, 1034, 164.0, 395.900000000001, 1034.0, 1034.0, 0.09666609383055508, 6.566282522434589, 0.21603025917253824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 375.8571428571429, 162, 1142, 323.0, 881.5, 1142.0, 1142.0, 0.07246151775824768, 12.480424876815421, 0.16031908623438196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 81.64285714285715, 79, 85, 81.0, 84.5, 85.0, 85.0, 0.07037722190943457, 0.0523018221416794, 0.03532606646625915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 80.42857142857142, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.07037934466775922, 0.01883197308492776, 0.040138220005831435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 91.57142857142858, 78, 238, 80.0, 160.5, 238.0, 238.0, 0.0703789908658124, 0.018969337381801, 0.04137514892697174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 101.64285714285714, 76, 236, 79.5, 234.5, 236.0, 236.0, 0.07038040609494317, 0.01896971883027765, 0.04144471179223704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b99e5d6-a3d5-4682-b059-0a6459c81787", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 83.33333333333333, 80, 89, 81.0, 89.0, 89.0, 89.0, 0.05692167577413479, 0.01678744734744991, 0.03518693434084699], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 955.8363636363634, 620, 1521, 928.0, 1325.4, 1400.9999999999995, 1521.0, 0.23866762712305703, 285.5294563314182, 0.4712753340261927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1206.7083333333335, 400, 2228, 1163.0, 1867.5, 2151.75, 2228.0, 0.10010928597051781, 0.03172408525139944, 0.04516649425622972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 79.42857142857143, 77, 80, 80.0, 80.0, 80.0, 80.0, 0.04040870518963228, 0.010891408820643076, 0.023795360575535416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.04040870518963228, 0.010891408820643076, 0.023755898949373667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 150.4, 77, 937, 80.0, 517.0000000000002, 937.0, 937.0, 0.08022419989731303, 4.832573139400244, 0.0467034372058446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 153.2, 79, 660, 81.0, 406.20000000000016, 660.0, 660.0, 0.08022377083812447, 1.5927447794381127, 0.04678153095033079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eb8197b-4976-467e-bac3-cc1bb5d70f5e", 3, 0, 0.0, 312.66666666666663, 180, 573, 185.0, 573.0, 573.0, 573.0, 0.08195153932308029, 0.0380413069904663, 0.05255355874559511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 94.86666666666666, 79, 241, 82.0, 154.00000000000006, 241.0, 241.0, 0.08022248368809498, 0.05961846688148465, 0.040267926382500804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 88.57142857142857, 79, 143, 80.0, 143.0, 143.0, 143.0, 0.04040870518963228, 0.010812485568319576, 0.023045589678462163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 113.33333333333333, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.08022334178352533, 0.02949879130165046, 0.04530320746291007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 85.57142857142857, 79, 107, 81.0, 107.0, 107.0, 107.0, 0.040408471924770976, 0.03003012415502999, 0.020283158759113556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 83.85714285714286, 82, 88, 83.0, 88.0, 88.0, 88.0, 0.0412767488073968, 0.032489315955822086, 0.01467259430262933], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 668.2666666666667, 78, 1524, 624.0, 1487.4, 1524.0, 1524.0, 0.08526699939744653, 0.01688686277129117, 0.0580215284962312], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcd1ab4a-784b-4c6d-ab67-9f3a104234f2", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1926.304347826087, 1043, 3975, 1819.0, 3042.200000000001, 3856.1999999999985, 3975.0, 0.10116515871933705, 0.052360873165281874, 0.04653202124688258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 175.85714285714286, 160, 226, 163.0, 226.0, 226.0, 226.0, 0.040389586410635156, 0.06259597034538866, 0.09083712646844996], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 948.280701754386, 418, 2809, 752.0, 1620.4, 1698.599999999999, 2809.0, 0.2743471020282433, 98.9823596994335, 0.9940476154664383], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 149.7454545454546, 78, 338, 83.0, 325.2, 332.2, 338.0, 0.23939376792732875, 0.17790884511005584, 0.11572257336330832], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 497.9272727272728, 384, 708, 470.0, 631.4, 658.5999999999998, 708.0, 0.23935938723996866, 70.37960732820524, 0.12038094182478892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3d81f91-52cb-4b33-a9c1-1435f46530ba", 3, 0, 0.0, 491.6666666666667, 208, 643, 624.0, 643.0, 643.0, 643.0, 0.039769865047591266, 0.033063878688654985, 0.02550346163533685], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 116.14545454545457, 77, 320, 84.0, 238.0, 239.6, 320.0, 0.2396858807584533, 0.42413165618585674, 0.11656598497823216], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 804.5454545454545, 540, 1159, 782.0, 1007.8, 1069.1999999999996, 1159.0, 0.23904313207350358, 215.09143043274412, 0.11998844715408286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 95.5, 81, 237, 83.0, 163.5, 237.0, 237.0, 0.07614447870945985, 0.05688527950462578, 0.027066982666253313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 8, 4.733727810650888, 163.86390532544377, 80, 1532, 89.0, 349.0, 436.5, 1204.4000000000053, 0.7002568989806911, 1.558263400441286, 0.3356544126025524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 113.64285714285715, 80, 243, 85.5, 241.5, 243.0, 243.0, 0.07087064588469345, 0.054883224791564364, 0.025192299904324627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d9a0a99-3d19-48c1-97e1-a503552d4862", 3, 0, 0.0, 364.0, 271, 492, 329.0, 492.0, 492.0, 492.0, 0.022607725813501334, 0.02672156654584093, 0.014497792920767456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64637d4b-fff4-4ef3-8da2-347d99bd3b77", 3, 0, 0.0, 664.6666666666667, 197, 1524, 273.0, 1524.0, 1524.0, 1524.0, 0.03742141502844028, 0.031196693973904798, 0.02399745690300369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 96.47058823529412, 80, 244, 86.0, 127.9999999999999, 244.0, 244.0, 0.08937537130209401, 0.07253020854691418, 0.03177015151754123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac73081d-062a-421b-8a96-caa1743ab33b", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5e251c7-0e13-4460-b844-bc5455edf0a1", 3, 0, 0.0, 331.0, 270, 413, 310.0, 413.0, 413.0, 413.0, 0.059900565061997084, 0.038510291665834716, 0.038412797256554124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 185.92857142857144, 161, 318, 163.5, 317.5, 318.0, 318.0, 0.07034857720002613, 0.10902655470355613, 0.1582155989176369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 278.9333333333334, 162, 1033, 175.0, 700.6000000000001, 1033.0, 1033.0, 0.0801881749171389, 6.511519950149684, 0.17897729171121565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22252f96-063c-4ee5-8b27-9ccba608f5cd", 3, 0, 0.0, 396.0, 187, 686, 315.0, 686.0, 686.0, 686.0, 0.023712603248626646, 0.028027494269454216, 0.015206324348891435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44424c3a-1315-480d-825d-9aadf6acd6ad", 3, 0, 0.0, 390.33333333333337, 184, 785, 202.0, 785.0, 785.0, 785.0, 0.043407801828915384, 0.027907034053420536, 0.027836383334297953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 92.0, 80, 117, 85.0, 117.0, 117.0, 117.0, 0.09096881791074948, 0.07542238906858038, 0.03233657199171173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 86.49999999999999, 81, 106, 83.5, 100.60000000000001, 106.0, 106.0, 0.08574899364028297, 0.06657270502346188, 0.03048108758306934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ba9d696-beda-4228-9715-14a7a3390c39", 3, 0, 0.0, 394.33333333333337, 230, 652, 301.0, 652.0, 652.0, 652.0, 0.029668014913122164, 0.024443276609737042, 0.019025387167594617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ac7355b-a403-45aa-9d30-bfb1af7225be", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 104.92857142857142, 78, 241, 83.5, 239.0, 241.0, 241.0, 0.0724952878062926, 0.05387589259823111, 0.03638923626214296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 136.7857142857143, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.07249603860931884, 0.03495344718663587, 0.04047560637758008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 235.85714285714286, 77, 900, 163.0, 720.5, 900.0, 900.0, 0.07249603860931884, 9.335614666078067, 0.0417297231169154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 202.7142857142857, 78, 538, 158.0, 505.0, 538.0, 538.0, 0.07249941741539577, 3.0620687255638126, 0.04180246821677326], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.3872966692486445], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.23237800154918667], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.0, 0.23237800154918667], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0844306738962044], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1291, 25, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
