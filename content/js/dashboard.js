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

    var data = {"OkPercent": 98.12171299774606, "KoPercent": 1.8782870022539444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7708737864077669, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39712cb4-23a9-4852-a201-de6a079ffe89"], "isController": false}, {"data": [0.1694915254237288, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd7c140c-cf0d-4637-9cc5-1c2947e13773"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c14c62cc-a587-4cae-8850-33981a20ba3c"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2107ccac-0c7c-4f57-be78-7b3411ead189"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6932b872-302b-4526-a2f7-c5f3370574cb"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58e19c79-3c34-43cb-ba3c-01bc2b86ca60"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d04dcf8a-ed46-4e4d-be70-a2ee06dcd15e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0195dcb-47d6-4664-aaeb-ad11e6f23920"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6820e371-70cb-4007-97ca-7e4c34eea8cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a3a1427-b1f0-4415-8b80-f02788c02c18"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ef31302-4780-4d8c-80b8-04f3b89feded"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14d6aa8b-f848-4f9b-a059-29ce955ee4c4"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cde70d9-ad05-456a-a942-14e5eca5f1cc"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6cde70d9-ad05-456a-a942-14e5eca5f1cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6932b872-302b-4526-a2f7-c5f3370574cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7039f975-d56a-4689-af62-ad44823cca13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2107ccac-0c7c-4f57-be78-7b3411ead189"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58e19c79-3c34-43cb-ba3c-01bc2b86ca60"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/8f62e6cb-6a69-4816-842e-6b94b4c7b95b"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb51e1af-3807-4201-b660-8c29807dd625"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd7c140c-cf0d-4637-9cc5-1c2947e13773"], "isController": false}, {"data": [0.6016949152542372, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39712cb4-23a9-4852-a201-de6a079ffe89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c14c62cc-a587-4cae-8850-33981a20ba3c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ef31302-4780-4d8c-80b8-04f3b89feded"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6820e371-70cb-4007-97ca-7e4c34eea8cf"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14d6aa8b-f848-4f9b-a059-29ce955ee4c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0195dcb-47d6-4664-aaeb-ad11e6f23920"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 25, 1.8782870022539444, 377.5259203606317, 96, 2919, 119.0, 1006.5999999999999, 1286.9999999999986, 2056.6800000000067, 5.18603083564841, 749.2005193823519, 3.7925483560360176], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/39712cb4-23a9-4852-a201-de6a079ffe89", 3, 0, 0.0, 355.3333333333333, 222, 578, 266.0, 578.0, 578.0, 578.0, 0.025875452820424357, 0.02611971979040883, 0.01659330796101432], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1642.6101694915258, 1215, 2342, 1620.0, 2040.0, 2065.0, 2342.0, 0.26360939343031775, 317.21128488356504, 1.2961653280484862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd7c140c-cf0d-4637-9cc5-1c2947e13773", 3, 0, 0.0, 359.0, 240, 500, 337.0, 500.0, 500.0, 500.0, 0.016839552741479188, 0.02321468289718892, 0.010798801725492838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c14c62cc-a587-4cae-8850-33981a20ba3c", 3, 0, 0.0, 403.0, 242, 641, 326.0, 641.0, 641.0, 641.0, 0.0449707690001499, 0.02891187134612502, 0.028838676735122172], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 580.1428571428572, 103, 1677, 501.5, 1265.5, 1677.0, 1677.0, 0.06426499210458668, 0.012659342752745032, 0.04324080035162131], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 580.1428571428572, 103, 1677, 501.5, 1265.5, 1677.0, 1677.0, 0.06531800537473872, 0.012866772264108688, 0.04394932197577635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 196.88888888888889, 99, 402, 102.5, 321.90000000000015, 402.0, 402.0, 0.11749807433711502, 0.08046119218115592, 0.06426950876013421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 125.72222222222224, 97, 307, 103.5, 299.8, 307.0, 307.0, 0.11749577341592851, 0.08731863629836094, 0.05897737064041724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2107ccac-0c7c-4f57-be78-7b3411ead189", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 303.5555555555556, 101, 809, 104.5, 803.6, 809.0, 809.0, 0.11749730735337316, 9.619569319331571, 0.06638546868370378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 386.61111111111114, 96, 1075, 104.0, 1071.4, 1075.0, 1075.0, 0.11749960833463888, 29.391304345608777, 0.06627202301686771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6932b872-302b-4526-a2f7-c5f3370574cb", 1, 0, 0.0, 2373.0, 2373, 2373, 2373.0, 2373.0, 2373.0, 2373.0, 0.42140750105351876, 0.07613319110830172, 0.2905407184997893], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 317.7857142857142, 100, 900, 249.0, 751.0, 900.0, 900.0, 0.06442053726728081, 0.10658866796734799, 0.04163788353227009], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.94444444444446, 100, 301, 103.0, 130.90000000000026, 301.0, 301.0, 0.09792294552220131, 0.0727728140062453, 0.0491527285140737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 147.00000000000003, 100, 304, 102.5, 300.4, 304.0, 304.0, 0.09791335755782328, 0.0425396141125786, 0.05492752371679105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 675.2, 580, 811, 610.0, 811.0, 811.0, 811.0, 0.03073726401465553, 9.03777619352796, 0.01752984588335823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 932.2, 717, 1225, 906.0, 1225.0, 1225.0, 1225.0, 0.03067710506294942, 27.60331306024063, 0.017465578370800306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 200.4, 99, 393, 112.0, 393.0, 393.0, 393.0, 0.03079234871719075, 0.05448802331596645, 0.017050060276022617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 103.35714285714285, 96, 117, 102.5, 112.5, 117.0, 117.0, 0.06216447832901882, 0.04619840625818684, 0.031203654161245774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 159.07142857142858, 96, 307, 103.5, 306.5, 307.0, 307.0, 0.06211565935772408, 0.016620791664078514, 0.03542533697745202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 168.2857142857143, 97, 411, 105.0, 359.0, 411.0, 411.0, 0.06216861905734611, 0.01675638560530032, 0.03654834831301012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 180.71428571428572, 98, 406, 106.0, 357.0, 406.0, 406.0, 0.06211510816902408, 0.01674196274868227, 0.03657754904875148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 141.8, 103, 293, 105.0, 293.0, 293.0, 293.0, 0.030828421338200112, 0.022910574842158485, 0.01731088112252448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58e19c79-3c34-43cb-ba3c-01bc2b86ca60", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 700.7333333333335, 98, 1485, 902.0, 1384.8, 1485.0, 1485.0, 0.06933851060879212, 37.44202379611011, 0.03718819338510609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 228.2777777777778, 97, 1037, 103.5, 839.0000000000003, 1037.0, 1037.0, 0.09791602069291903, 9.812904328568088, 0.05662894859952892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 520.5333333333333, 99, 1012, 777.0, 898.0000000000001, 1012.0, 1012.0, 0.06933819008833686, 12.240113601957187, 0.037255734557229435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 179.72222222222226, 98, 598, 104.0, 589.0, 598.0, 598.0, 0.0979176186435146, 3.2224628797027655, 0.056725495435951], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 702.076923076923, 106, 2373, 478.0, 2219.0, 2373.0, 2373.0, 0.06530202185106115, 0.012945615659927164, 0.04430647996986061], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 316.2142857142857, 199, 508, 313.5, 460.0, 508.0, 508.0, 0.062082330038535395, 0.0962154861046442, 0.13962461531127637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 593.4285714285713, 168, 1295, 469.0, 1150.8000000000002, 1283.9999999999998, 1295.0, 0.10145172588709872, 0.062317515217758884, 0.045871239341529986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 103.13333333333333, 99, 109, 103.0, 107.8, 109.0, 109.0, 0.06933626702783158, 0.05152822188298812, 0.034803555910454524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d04dcf8a-ed46-4e4d-be70-a2ee06dcd15e", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 168.2, 96, 312, 103.0, 310.8, 312.0, 312.0, 0.06933915165859252, 0.08104013350098, 0.03605094174124478], "isController": false}, {"data": ["login", 21, 0, 0.0, 2947.9523809523803, 2026, 3885, 2881.0, 3817.2000000000003, 3880.7999999999997, 3885.0, 0.1007759750075582, 28.84408138349817, 0.19183707854047594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 110.83333333333334, 103, 143, 108.0, 132.20000000000002, 143.0, 143.0, 0.0929209707144074, 0.07522605929906614, 0.03303050130863701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0195dcb-47d6-4664-aaeb-ad11e6f23920", 3, 0, 0.0, 390.6666666666667, 301, 469, 402.0, 469.0, 469.0, 469.0, 0.046505138817839374, 0.029898323295974204, 0.029822631338262878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6820e371-70cb-4007-97ca-7e4c34eea8cf", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.2660737297496318, 1.0153948821796759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a3a1427-b1f0-4415-8b80-f02788c02c18", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 805.5333333333333, 200, 1594, 1007.0, 1488.4, 1594.0, 1594.0, 0.06930391151276577, 49.78990627512267, 0.14522688801180939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ef31302-4780-4d8c-80b8-04f3b89feded", 3, 0, 0.0, 365.3333333333333, 256, 480, 360.0, 480.0, 480.0, 480.0, 0.07118788856722509, 0.03221066572540458, 0.04565108739499786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14d6aa8b-f848-4f9b-a059-29ce955ee4c4", 3, 0, 0.0, 620.3333333333334, 209, 1169, 483.0, 1169.0, 1169.0, 1169.0, 0.029371450949676914, 0.029457500122381044, 0.01883520780301547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 644.8888888888889, 100, 1518, 823.0, 1518.0, 1518.0, 1518.0, 0.049297780504371065, 32.77102053937249, 0.07627355167229027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 548.2222222222223, 198, 1188, 412.5, 1177.2, 1188.0, 1188.0, 0.1174160638221538, 39.15098885322014, 0.2557264792793263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cde70d9-ad05-456a-a942-14e5eca5f1cc", 1, 0, 0.0, 1988.0, 1988, 1988, 1988.0, 1988.0, 1988.0, 1988.0, 0.5030181086519115, 0.09087729502012072, 0.3468074069416499], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1190.4999999999998, 162, 2089, 1207.0, 1919.7, 2063.6499999999996, 2089.0, 0.08996961480736278, 0.02830720124975974, 0.040591759805665636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 378.7777777777778, 202, 1338, 222.5, 963.6000000000006, 1338.0, 1338.0, 0.09785799717299119, 13.142830202783516, 0.21730294185604002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 107.4375, 103, 121, 107.0, 114.7, 121.0, 121.0, 0.08805384492617235, 0.06836211593389357, 0.03130039018860033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cde70d9-ad05-456a-a942-14e5eca5f1cc", 3, 0, 0.0, 939.3333333333334, 219, 2378, 221.0, 2378.0, 2378.0, 2378.0, 0.04319778827324041, 0.027772015572802674, 0.027701706672618363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6932b872-302b-4526-a2f7-c5f3370574cb", 3, 0, 0.0, 656.6666666666666, 602, 753, 615.0, 753.0, 753.0, 753.0, 0.08374274229566771, 0.037891410088209024, 0.05370221429767754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 242.05882352941177, 202, 413, 208.0, 409.8, 413.0, 413.0, 0.09691745483361554, 0.1502031258017069, 0.21796962742364898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7039f975-d56a-4689-af62-ad44823cca13", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 105.36363636363637, 98, 120, 104.0, 119.0, 120.0, 120.0, 0.05817028027498678, 0.043230061805922794, 0.029198753966155473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 119.36363636363637, 96, 296, 102.0, 258.8000000000001, 296.0, 296.0, 0.05817058789311419, 0.015565176838587196, 0.03317541340779169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2107ccac-0c7c-4f57-be78-7b3411ead189", 3, 0, 0.0, 657.3333333333334, 413, 1115, 444.0, 1115.0, 1115.0, 1115.0, 0.037439161362785474, 0.02406977333707725, 0.024008837202046676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 102.81818181818181, 99, 113, 102.0, 111.60000000000001, 113.0, 113.0, 0.05817212603255524, 0.015679205844712153, 0.03419884753085767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 138.9090909090909, 97, 310, 104.0, 305.8, 310.0, 310.0, 0.05817181839815966, 0.01567912292762897, 0.034255475091885035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 0.03331057110974168, 0.009824016089005846, 0.02059139796139305], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1144.2711864406783, 765, 1893, 1030.0, 1617.0, 1635.0, 1893.0, 0.2561208543149852, 306.40958377648025, 0.505738640063379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1190.4999999999998, 162, 2089, 1207.0, 1919.7, 2063.6499999999996, 2089.0, 0.08857966532991898, 0.027869880497978772, 0.03996465369377204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.625, 99, 104, 101.5, 104.0, 104.0, 104.0, 0.05224182741912312, 0.01408080504656053, 0.030763497982159417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 152.375, 100, 310, 103.0, 310.0, 310.0, 310.0, 0.05224148627028439, 0.01408071309628759, 0.03071228001436641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 156.0, 96, 403, 100.0, 334.4000000000001, 403.0, 403.0, 0.08452192287374537, 0.02278129952456418, 0.049689646064447965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 163.9375, 96, 307, 102.0, 305.6, 307.0, 307.0, 0.08465742842478981, 0.02281782250511913, 0.04985198177748853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 141.43750000000003, 99, 299, 104.0, 299.0, 299.0, 299.0, 0.08464041050599096, 0.06290171132329991, 0.04248551855476499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 150.5, 97, 310, 100.5, 310.0, 310.0, 310.0, 0.05224182741912312, 0.013978770227382555, 0.029794167199968656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 163.125, 98, 307, 102.0, 303.5, 307.0, 307.0, 0.08465742842478981, 0.02265247596522696, 0.04828118964851293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 103.0, 99, 107, 103.0, 107.0, 107.0, 107.0, 0.05224250973016744, 0.03882475576626701, 0.026223291016900453], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 836.2307692307692, 102, 2510, 578.0, 2457.2, 2510.0, 2510.0, 0.0663600492085288, 0.012876202456853206, 0.04515893072266093], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 131.375, 103, 302, 108.0, 302.0, 302.0, 302.0, 0.05184570717544587, 0.04080824217129821, 0.018429528722521776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1828.857142857143, 1307, 2919, 1663.0, 2514.0, 2881.5999999999995, 2919.0, 0.09832519419225852, 0.05089096965029006, 0.045225748500540786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 256.625, 203, 411, 207.0, 411.0, 411.0, 411.0, 0.05220739387215714, 0.0809112637452279, 0.11741565242927529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58e19c79-3c34-43cb-ba3c-01bc2b86ca60", 3, 0, 0.0, 425.66666666666663, 199, 878, 200.0, 878.0, 878.0, 878.0, 0.05559158713981284, 0.0363914979616418, 0.03564955295098675], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1234.5862068965514, 527, 3775, 903.0, 1945.9000000000003, 3103.6499999999987, 3775.0, 0.26580509154235693, 88.78439641048554, 0.9642461002841364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8f62e6cb-6a69-4816-842e-6b94b4c7b95b", 2, 0, 0.0, 583.0, 266, 900, 583.0, 900.0, 900.0, 900.0, 0.01211482430476052, 0.02394570741487822, 0.007530357099589914], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 193.86440677966095, 98, 595, 106.0, 418.0, 442.0, 595.0, 0.25690038796312825, 0.1909191359765045, 0.12418524613452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb51e1af-3807-4201-b660-8c29807dd625", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd7c140c-cf0d-4637-9cc5-1c2947e13773", 1, 0, 0.0, 832.0, 832, 832, 832.0, 832.0, 832.0, 832.0, 1.201923076923077, 0.2171443058894231, 0.8286696213942308], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 651.9830508474577, 475, 921, 605.0, 815.0, 895.0, 921.0, 0.2567461129073669, 75.49188196804599, 0.12912524233134173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39712cb4-23a9-4852-a201-de6a079ffe89", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 158.42372881355934, 97, 402, 105.0, 306.0, 310.0, 402.0, 0.257292497961284, 0.45528711553305334, 0.12512857811007758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c14c62cc-a587-4cae-8850-33981a20ba3c", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 948.4237288135591, 664, 1314, 904.0, 1224.0, 1296.0, 1314.0, 0.25662327268614976, 230.91007185859405, 0.12881285367254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 109.64705882352939, 103, 126, 109.0, 119.6, 126.0, 126.0, 0.09852844864059719, 0.07360767891607116, 0.03502378447771229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 222.24571428571426, 100, 2792, 110.0, 353.0000000000001, 837.1999999999974, 2484.9600000000037, 0.7146590871965762, 1.6138453840169558, 0.3404720438126858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 164.27272727272725, 104, 322, 109.0, 319.8, 322.0, 322.0, 0.05711259488478832, 0.04422879662464564, 0.020301742712952098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 124.38888888888889, 100, 312, 106.0, 223.80000000000013, 312.0, 312.0, 0.11287106362165619, 0.09159751354452764, 0.040122135896760606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ef31302-4780-4d8c-80b8-04f3b89feded", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 246.5454545454545, 200, 430, 210.0, 423.40000000000003, 430.0, 430.0, 0.0581383057440646, 0.0901030187654595, 0.13075441223494216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6820e371-70cb-4007-97ca-7e4c34eea8cf", 3, 0, 0.0, 990.6666666666666, 197, 2510, 265.0, 2510.0, 2510.0, 2510.0, 0.040412204485754694, 0.02598115360005388, 0.025915378527648684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 374.1875, 201, 607, 398.0, 606.3, 607.0, 607.0, 0.08446035114390987, 0.13089704811072753, 0.18995330926213327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14d6aa8b-f848-4f9b-a059-29ce955ee4c4", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 109.14285714285714, 103, 131, 106.0, 126.0, 131.0, 131.0, 0.061121225218617535, 0.050675703330670195, 0.02172668552693045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 123.26666666666667, 102, 306, 106.0, 204.00000000000006, 306.0, 306.0, 0.06959781741244594, 0.05403346176063919, 0.024739849158330395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0195dcb-47d6-4664-aaeb-ad11e6f23920", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 102.70588235294119, 98, 106, 103.0, 105.2, 106.0, 106.0, 0.09697605832254237, 0.07206912146821753, 0.0486774355251824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 113.35294117647058, 96, 303, 102.0, 146.99999999999986, 303.0, 303.0, 0.09697605832254237, 0.025948671855836533, 0.05530665826207495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 136.52941176470588, 97, 312, 101.0, 305.6, 312.0, 312.0, 0.09697716472997564, 0.026138376431126247, 0.05701196598383333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 113.41176470588235, 96, 304, 102.0, 145.59999999999985, 304.0, 304.0, 0.0969749519403547, 0.02613778001517373, 0.05710536720706434], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.4507888805409467], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15026296018031554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15026296018031554], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1269722013523666], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 25, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
