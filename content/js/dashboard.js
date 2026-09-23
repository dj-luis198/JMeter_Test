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

    var data = {"OkPercent": 98.6024844720497, "KoPercent": 1.3975155279503106};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7349037823490379, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bffa5384-9d78-4de3-8e60-0683b8575d5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/090ddd98-ca80-423d-b408-710521c181eb"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef31f90f-8b54-4224-b70d-a783cd579666"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=591aba92-f9c2-4741-807c-0a647a47f23c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2704e50-b524-491f-89f4-ae3aa117fca7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15759314-c46f-4c00-81e0-dab1f15e65bb"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ce56c15-2ca1-4c2f-ab6a-955a331eba57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82b3b3ed-291b-4db9-b602-27eb89729d6f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3905b41f-7345-4f2b-a9d1-566cf5be7318"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12a9fd64-7f9c-449c-bfa5-c2f244e595d1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c603e5e-544c-4ffe-a73f-2c17e75f03d1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4903c467-9b7a-4b80-b289-02cd463e6618"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/591aba92-f9c2-4741-807c-0a647a47f23c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f86ed47-54dd-482d-beff-36743696c437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3905b41f-7345-4f2b-a9d1-566cf5be7318"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2704e50-b524-491f-89f4-ae3aa117fca7"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507f850e-e7e3-4c55-8a13-5758908b1c20"], "isController": false}, {"data": [0.8796296296296297, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=090ddd98-ca80-423d-b408-710521c181eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/92f85a0e-e1e3-4196-a4aa-907db182bcc6"], "isController": false}, {"data": [0.4351851851851852, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9534883720930233, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bffa5384-9d78-4de3-8e60-0683b8575d5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ce56c15-2ca1-4c2f-ab6a-955a331eba57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4903c467-9b7a-4b80-b289-02cd463e6618"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82b3b3ed-291b-4db9-b602-27eb89729d6f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/507f850e-e7e3-4c55-8a13-5758908b1c20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc29d9e7-45c0-4f32-ac9c-5de6a8df3288"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15759314-c46f-4c00-81e0-dab1f15e65bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f86ed47-54dd-482d-beff-36743696c437"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c603e5e-544c-4ffe-a73f-2c17e75f03d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12a9fd64-7f9c-449c-bfa5-c2f244e595d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 18, 1.3975155279503106, 466.6436335403728, 125, 5351, 150.0, 1256.3000000000004, 1550.6499999999999, 2238.2299999999905, 5.069229618784487, 700.1134422462532, 3.6997929064239106], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2195.222222222222, 1533, 5898, 2124.5, 2644.5, 2723.5, 5898.0, 0.23810783639345995, 286.5236088811467, 1.1707743713291707], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bffa5384-9d78-4de3-8e60-0683b8575d5e", 3, 0, 0.0, 988.3333333333334, 227, 2509, 229.0, 2509.0, 2509.0, 2509.0, 0.01812612155377114, 0.02498832186856145, 0.011623847480771205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/090ddd98-ca80-423d-b408-710521c181eb", 3, 0, 0.0, 415.0, 331, 540, 374.0, 540.0, 540.0, 540.0, 0.022889580662882256, 0.022956639981230546, 0.01467853968290301], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 717.6666666666666, 131, 2044, 546.0, 1545.4000000000003, 2044.0, 2044.0, 0.08180137535379095, 0.016024761617158656, 0.0550774624940694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 717.6666666666666, 131, 2044, 546.0, 1545.4000000000003, 2044.0, 2044.0, 0.08000469360869171, 0.01567279447060894, 0.05386774357428969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 174.8823529411765, 125, 395, 130.0, 383.8, 395.0, 395.0, 0.11839594389425154, 0.03168016467482902, 0.06752268675219032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 176.52941176470586, 127, 396, 132.0, 386.4, 396.0, 396.0, 0.11860244460568176, 0.08814107455558966, 0.05953286770246134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 291.64705882352933, 127, 777, 380.0, 487.39999999999975, 777.0, 777.0, 0.11839594389425154, 0.03191140675274748, 0.06971948649241569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 232.0, 127, 554, 133.0, 432.39999999999986, 554.0, 554.0, 0.11860575447213462, 0.031967957260067535, 0.06972721112521978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef31f90f-8b54-4224-b70d-a783cd579666", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 293.06666666666666, 133, 514, 265.0, 463.0, 514.0, 514.0, 0.08281802120141343, 0.1874512581437721, 0.0535297730786219], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 148.46666666666667, 127, 395, 129.0, 246.2000000000001, 395.0, 395.0, 0.08135857980463093, 0.06046277268683998, 0.04083819337849638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 146.59999999999997, 125, 374, 130.0, 233.60000000000008, 374.0, 374.0, 0.08135902108825827, 0.03806288577735833, 0.0454890151761694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 891.2, 758, 1018, 890.0, 1018.0, 1018.0, 1018.0, 0.0754979087079288, 22.19889192663113, 0.04305740105999063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1381.6, 1135, 1697, 1376.0, 1697.0, 1697.0, 1697.0, 0.07507507507507508, 67.55268452045796, 0.042742938250750755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 339.8, 129, 403, 391.0, 403.0, 403.0, 403.0, 0.076057195010648, 0.13458558335868573, 0.042113700752966235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 179.71428571428572, 127, 421, 131.5, 402.0, 421.0, 421.0, 0.08347096104887225, 0.062032618513859154, 0.0418985097452347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 185.14285714285714, 126, 393, 131.0, 389.0, 393.0, 393.0, 0.08347145872336366, 0.03129015200748858, 0.047104080710938336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 312.85714285714283, 126, 1921, 132.5, 1154.0, 1921.0, 1921.0, 0.08347295178244564, 5.385827867221365, 0.04856057602299084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 240.14285714285717, 127, 1037, 130.0, 773.5, 1037.0, 1037.0, 0.08347195640378963, 1.774000330161399, 0.04864151254166145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 235.4, 128, 390, 142.0, 390.0, 390.0, 390.0, 0.07607802562307903, 0.05653845458902651, 0.04271959446608442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 770.35, 126, 1593, 720.0, 1499.8000000000002, 1588.5, 1593.0, 0.09217226997257875, 41.48080692501786, 0.05022668617646381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 262.8, 125, 1262, 129.0, 1104.8000000000002, 1262.0, 1262.0, 0.08135725598247022, 9.779724805691753, 0.04689694950968693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=591aba92-f9c2-4741-807c-0a647a47f23c", 1, 0, 0.0, 1376.0, 1376, 1376, 1376.0, 1376.0, 1376.0, 1376.0, 0.7267441860465116, 0.13129655704941862, 0.5010560501453489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 577.05, 127, 1154, 584.0, 1047.5, 1148.75, 1154.0, 0.09217226997257875, 13.563275543240316, 0.050316698158858905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 296.6666666666667, 128, 1042, 142.0, 796.0000000000001, 1042.0, 1042.0, 0.08135637345829673, 3.2085343513727533, 0.04697589037771052], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 774.8666666666666, 134, 1727, 633.0, 1516.4, 1727.0, 1727.0, 0.08014019190904621, 0.0156993383759323, 0.05449115652982284], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2704e50-b524-491f-89f4-ae3aa117fca7", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 540.4285714285716, 258, 2343, 332.5, 1560.0, 2343.0, 2343.0, 0.08340482318177485, 7.247254296465423, 0.18605512314126393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 615.5238095238095, 165, 1466, 517.0, 1205.8000000000002, 1444.9999999999998, 1466.0, 0.09024339933993399, 0.0554327130711118, 0.04080341200623969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 146.35000000000002, 127, 388, 133.5, 142.9, 375.74999999999983, 388.0, 0.09227773753443114, 0.06857749830439658, 0.046319098723337504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 214.75, 125, 506, 132.5, 416.70000000000005, 501.69999999999993, 506.0, 0.09228242112160054, 0.09399469260725525, 0.0487546775652206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15759314-c46f-4c00-81e0-dab1f15e65bb", 1, 0, 0.0, 1727.0, 1727, 1727, 1727.0, 1727.0, 1727.0, 1727.0, 0.5790387955993052, 0.10461150115807759, 0.39922010712217715], "isController": false}, {"data": ["login", 21, 0, 0.0, 2855.0952380952385, 1572, 5340, 2665.0, 4087.6000000000004, 5220.199999999998, 5340.0, 0.08917841202974312, 25.524629000554178, 0.16975996542213237], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 135.06666666666666, 128, 146, 134.0, 143.6, 146.0, 146.0, 0.07775243624300228, 0.06294606410688369, 0.02763856132075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ce56c15-2ca1-4c2f-ab6a-955a331eba57", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82b3b3ed-291b-4db9-b602-27eb89729d6f", 1, 0, 0.0, 1187.0, 1187, 1187, 1187.0, 1187.0, 1187.0, 1187.0, 0.8424599831508003, 0.15220224304970514, 0.5808366680707666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3905b41f-7345-4f2b-a9d1-566cf5be7318", 3, 0, 0.0, 705.3333333333333, 265, 1527, 324.0, 1527.0, 1527.0, 1527.0, 0.017884608505919806, 0.024655376634951296, 0.01146897094943425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 950.15, 259, 1723, 984.0, 1636.0, 1718.85, 1723.0, 0.09211411096065807, 55.171629818143714, 0.19538266504545831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12a9fd64-7f9c-449c-bfa5-c2f244e595d1", 1, 0, 0.0, 977.0, 977, 977, 977.0, 977.0, 977.0, 977.0, 1.0235414534288638, 0.18491715711361312, 0.7056838536335722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c603e5e-544c-4ffe-a73f-2c17e75f03d1", 3, 0, 0.0, 365.6666666666667, 259, 524, 314.0, 524.0, 524.0, 524.0, 0.028245130068823968, 0.02853935017370755, 0.01811292520689558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4903c467-9b7a-4b80-b289-02cd463e6618", 3, 0, 0.0, 484.66666666666663, 242, 868, 344.0, 868.0, 868.0, 868.0, 0.048073841420421766, 0.031470213247548236, 0.030828602733799115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 511.8235294117647, 262, 911, 520.0, 830.9999999999999, 911.0, 911.0, 0.11828802438124926, 0.18332333466117437, 0.266032539209001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 958.1111111111111, 131, 1828, 1263.0, 1828.0, 1828.0, 1828.0, 0.13435643268742722, 89.31431334532589, 0.2078763426312961], "isController": false}, {"data": ["register", 25, 7, 28.0, 1175.9999999999998, 132, 2886, 1180.0, 1845.2, 2582.399999999999, 2886.0, 0.09782783084394113, 0.030754624321563995, 0.04413716586904375], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 485.40000000000003, 258, 1657, 282.0, 1340.8000000000002, 1657.0, 1657.0, 0.08129993170805737, 13.077596846849898, 0.18007193858332157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 135.53846153846155, 129, 151, 133.0, 151.0, 151.0, 151.0, 0.17709724000762883, 0.13749248613873524, 0.0629525345339618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 371.5294117647059, 256, 545, 276.0, 542.6, 545.0, 545.0, 0.08891864467063487, 0.13780653231669682, 0.19998011589499232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 133.28571428571428, 128, 148, 132.0, 148.0, 148.0, 148.0, 0.045105417805041494, 0.03352072553675447, 0.02264080542167122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 166.0, 127, 383, 129.0, 383.0, 383.0, 383.0, 0.04510658040570147, 0.01206953421011934, 0.025724846637626624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 129.28571428571428, 128, 132, 128.0, 132.0, 132.0, 132.0, 0.04510658040570147, 0.012157632999974227, 0.026517735746320593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/591aba92-f9c2-4741-807c-0a647a47f23c", 3, 0, 0.0, 776.3333333333333, 243, 1781, 305.0, 1781.0, 1781.0, 1781.0, 0.015037217112353075, 0.020730017731385178, 0.009643007067492044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 165.57142857142858, 125, 381, 130.0, 381.0, 381.0, 381.0, 0.04510483652718533, 0.012157162970217922, 0.026560758228410895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 200.5, 134, 267, 200.5, 267.0, 267.0, 267.0, 0.23860653781913624, 0.07037028752087808, 0.14749798675733716], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1517.0740740740744, 1009, 5351, 1301.0, 2092.0, 2155.75, 5351.0, 0.24784739943821257, 296.51165542556316, 0.48940179850006427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1175.9999999999998, 132, 2886, 1180.0, 1845.2, 2582.399999999999, 2886.0, 0.09950407170661424, 0.03128159254276685, 0.04489343860200759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 156.2, 126, 379, 131.5, 355.20000000000005, 379.0, 379.0, 0.06069360653548755, 0.016358823636518128, 0.03574047337978417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 159.8, 127, 420, 129.5, 392.60000000000014, 420.0, 420.0, 0.06069434328720563, 0.016359022214129645, 0.03568163540907988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 575.0, 128, 4150, 131.0, 2942.799999999999, 4150.0, 4150.0, 0.16700710422527973, 23.15705552825632, 0.09597388426407678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 393.3076923076923, 127, 2405, 132.0, 1746.1999999999994, 2405.0, 2405.0, 0.16700281335508652, 7.59260627159796, 0.09613450711688912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f86ed47-54dd-482d-beff-36743696c437", 3, 0, 0.0, 589.0, 257, 1068, 442.0, 1068.0, 1068.0, 1068.0, 0.027921781781968115, 0.028003583877032473, 0.017905569697420957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 205.5, 128, 392, 128.5, 391.4, 392.0, 392.0, 0.06069544844832086, 0.016240774291835854, 0.03461537294318299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 153.76923076923077, 128, 404, 131.0, 299.5999999999999, 404.0, 404.0, 0.16700495876262172, 0.12411208361167493, 0.0838286609413941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 181.4, 127, 388, 131.0, 387.8, 388.0, 388.0, 0.06069544844832086, 0.04510667604411345, 0.030466270021911056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 169.76923076923075, 126, 396, 131.0, 387.59999999999997, 396.0, 396.0, 0.1670092497430627, 0.08327880106628982, 0.09308959082733813], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 903.9333333333333, 131, 2509, 720.0, 2072.2000000000003, 2509.0, 2509.0, 0.07788849483080022, 0.014974265965843298, 0.053005757582444975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 193.3, 132, 449, 134.5, 444.3, 449.0, 449.0, 0.06003878505514562, 0.04725709058051501, 0.021341911875071295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3905b41f-7345-4f2b-a9d1-566cf5be7318", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1553.0952380952378, 836, 2830, 1430.0, 2618.4000000000005, 2818.6, 2830.0, 0.09174472249405843, 0.04748506144712009, 0.04219898856904446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 394.3, 260, 808, 265.5, 805.0, 808.0, 808.0, 0.06064612380299713, 0.09398964694859029, 0.1363945538264672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2704e50-b524-491f-89f4-ae3aa117fca7", 3, 0, 0.0, 477.3333333333333, 219, 720, 493.0, 720.0, 720.0, 720.0, 0.03127606338615513, 0.03136769247810676, 0.020056590127189324], "isController": false}, {"data": ["addBook", 59, 3, 5.084745762711864, 1471.4576271186445, 657, 7177, 1087.0, 2239.0, 3258.0, 7177.0, 0.270363157291786, 83.23204261656548, 0.9846309714743957], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507f850e-e7e3-4c55-8a13-5758908b1c20", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 255.0185185185185, 127, 567, 137.5, 545.5, 564.5, 567.0, 0.2497167564567967, 0.18558051920275612, 0.12071268988878356], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 838.0740740740741, 627, 1537, 771.5, 1046.5, 1172.75, 1537.0, 0.24945028548199338, 73.3466664607162, 0.12545595412424473], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 189.31481481481487, 127, 513, 133.0, 392.0, 401.25, 513.0, 0.2501864815904447, 0.44271279750184167, 0.121672722492228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=090ddd98-ca80-423d-b408-710521c181eb", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92f85a0e-e1e3-4196-a4aa-907db182bcc6", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.47169266986706054, 0.881358474889217], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1256.0370370370365, 878, 5211, 1155.5, 1572.5, 1698.0, 5211.0, 0.24847006855933376, 223.57380445348088, 0.1247203273823218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 166.0, 130, 389, 135.0, 386.6, 389.0, 389.0, 0.08874967371443487, 0.06630224647611589, 0.03154773557817802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, 1.744186046511628, 244.62790697674416, 126, 2719, 141.0, 401.00000000000017, 484.49999999999994, 2428.460000000004, 0.7509834827295631, 1.5473769746062795, 0.36365955588277676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 141.28571428571428, 132, 151, 144.0, 151.0, 151.0, 151.0, 0.04414314992905565, 0.03418507606810658, 0.015691510326344003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bffa5384-9d78-4de3-8e60-0683b8575d5e", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.15833835451358458, 0.6042533961437335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ce56c15-2ca1-4c2f-ab6a-955a331eba57", 3, 0, 0.0, 479.3333333333333, 378, 631, 429.0, 631.0, 631.0, 631.0, 0.06631446318442052, 0.03000556765180486, 0.04252587645615509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4903c467-9b7a-4b80-b289-02cd463e6618", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 135.41176470588235, 130, 143, 134.0, 142.2, 143.0, 143.0, 0.11108787704532386, 0.09015041584439855, 0.03948826879345496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82b3b3ed-291b-4db9-b602-27eb89729d6f", 3, 0, 0.0, 555.3333333333334, 339, 915, 412.0, 915.0, 915.0, 915.0, 0.0341907616562005, 0.028503431185393707, 0.021925716296456697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 301.5714285714286, 258, 517, 265.0, 517.0, 517.0, 517.0, 0.04506621514611111, 0.06984383148132649, 0.10135497410302137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507f850e-e7e3-4c55-8a13-5758908b1c20", 3, 0, 0.0, 437.6666666666667, 231, 568, 514.0, 568.0, 568.0, 568.0, 0.017060576420008643, 0.023519381881099158, 0.010940538915174814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc29d9e7-45c0-4f32-ac9c-5de6a8df3288", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 749.6153846153845, 262, 4281, 272.0, 3072.599999999999, 4281.0, 4281.0, 0.16672010259698622, 30.904048272683553, 0.36839481805065727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15759314-c46f-4c00-81e0-dab1f15e65bb", 3, 0, 0.0, 636.6666666666667, 236, 1355, 319.0, 1355.0, 1355.0, 1355.0, 0.016820292000269122, 0.02318813041052726, 0.010786450273610084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 152.3571428571429, 129, 386, 134.0, 264.5, 386.0, 386.0, 0.08665296724517839, 0.07184411053823872, 0.030802421950434505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f86ed47-54dd-482d-beff-36743696c437", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c603e5e-544c-4ffe-a73f-2c17e75f03d1", 1, 0, 0.0, 1282.0, 1282, 1282, 1282.0, 1282.0, 1282.0, 1282.0, 0.7800312012480499, 0.14092360569422777, 0.5377949492979719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 136.35000000000002, 129, 147, 134.0, 146.70000000000002, 147.0, 147.0, 0.09353836943914394, 0.07262012080480414, 0.033249967261570694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12a9fd64-7f9c-449c-bfa5-c2f244e595d1", 3, 0, 0.0, 523.6666666666666, 251, 913, 407.0, 913.0, 913.0, 913.0, 0.08049585446349512, 0.03642227789852156, 0.05162006292092624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 131.7058823529412, 127, 139, 131.0, 138.2, 139.0, 139.0, 0.08897961320038732, 0.06612645082567847, 0.044663594907225664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 175.2941176470588, 126, 385, 130.0, 385.0, 385.0, 385.0, 0.08898054466561635, 0.023809247303104374, 0.05074671687960933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 190.05882352941177, 126, 402, 130.0, 388.4, 402.0, 402.0, 0.08897914747508584, 0.02398266084289423, 0.05231000662109538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 206.88235294117646, 126, 416, 131.0, 396.0, 416.0, 416.0, 0.08898007893056413, 0.023982911899253615, 0.05239744882336931], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5434782608695652], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.15527950310559005], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.15527950310559005], "isController": false}, {"data": ["401/Unauthorized", 7, 38.888888888888886, 0.5434782608695652], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 18, "406/Not Acceptable", 7, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
