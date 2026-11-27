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

    var data = {"OkPercent": 98.17490494296578, "KoPercent": 1.8250950570342206};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8143693107932379, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8a7e6b7-b60c-4257-9df4-182db56a11a2"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/646d7263-bf01-4ae7-8274-65bab0ba3544"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59f5639b-ef50-4ce6-bdd7-f5f0dd04a04e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af575aa3-2690-4834-a95e-ade59be5e96c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf9b97d9-d2ca-4663-ae6b-a212551809e5"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/51f761ba-3b27-4a1e-97cc-db3200fbc4be"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f020deb8-4085-4712-ab94-b2c177340bc3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b4c3bf5-170f-4e0a-b44d-30208d064b4b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cf9b97d9-d2ca-4663-ae6b-a212551809e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b95fc6a-294b-40af-8495-0792b083846a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03aaa2f8-42f0-482c-8cfc-45f523223fd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8318a59d-3022-4dce-b8a8-37353d716f59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d580dc6e-9a96-46cb-bc54-d5539e002bd4"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e73915a8-70a4-4e1c-b8f1-e3690d05b0e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c60e624a-f7bc-4067-ac2a-200f5cc3499d"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e8e569f-6af8-4f65-b224-e33a5ef2e3f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59f5639b-ef50-4ce6-bdd7-f5f0dd04a04e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df5fd886-653c-4190-ac72-994079ccf235"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8620689655172413, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9397590361445783, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8a7e6b7-b60c-4257-9df4-182db56a11a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f761ba-3b27-4a1e-97cc-db3200fbc4be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8318a59d-3022-4dce-b8a8-37353d716f59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af575aa3-2690-4834-a95e-ade59be5e96c"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df5fd886-653c-4190-ac72-994079ccf235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b95fc6a-294b-40af-8495-0792b083846a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c60e624a-f7bc-4067-ac2a-200f5cc3499d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e73915a8-70a4-4e1c-b8f1-e3690d05b0e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d580dc6e-9a96-46cb-bc54-d5539e002bd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b4c3bf5-170f-4e0a-b44d-30208d064b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=646d7263-bf01-4ae7-8274-65bab0ba3544"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c594906f-27a4-4560-99c3-9649f87cf3cb"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 24, 1.8250950570342206, 277.1003802281367, 79, 2480, 100.0, 642.4000000000001, 799.0, 1423.5199999999998, 5.114999980551331, 766.4803387933852, 3.7300078317359495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e8a7e6b7-b60c-4257-9df4-182db56a11a2", 3, 0, 0.0, 309.6666666666667, 187, 533, 209.0, 533.0, 533.0, 533.0, 0.03307935737835066, 0.027576899168605482, 0.021212999360465758], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1160.2758620689651, 962, 1511, 1137.5, 1382.5, 1446.6499999999999, 1511.0, 0.2635872405597139, 317.1835509845324, 1.2960564025567962], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/646d7263-bf01-4ae7-8274-65bab0ba3544", 3, 0, 0.0, 262.0, 171, 441, 174.0, 441.0, 441.0, 441.0, 0.03550337873820992, 0.02959770603794128, 0.022767466183031753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59f5639b-ef50-4ce6-bdd7-f5f0dd04a04e", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 704.8666666666668, 82, 1745, 501.0, 1695.2, 1745.0, 1745.0, 0.0962389806367171, 0.018853065933325634, 0.06479840740526877], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 704.8666666666668, 82, 1745, 501.0, 1695.2, 1745.0, 1745.0, 0.09532646135465256, 0.01867430483178057, 0.06418400151886827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 118.66666666666666, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.11643315350879625, 0.031154964903720873, 0.06640328286048536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 94.47619047619048, 80, 333, 82.0, 94.60000000000001, 309.39999999999964, 333.0, 0.11643186241080487, 0.0865279758736548, 0.05844333718667354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 111.66666666666666, 79, 242, 81.0, 241.0, 241.9, 242.0, 0.11643250795622138, 0.03138219941007529, 0.06856328349375146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 118.85714285714286, 79, 242, 81.0, 240.8, 241.9, 242.0, 0.11632995607159277, 0.031354558472421495, 0.06838929058115123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af575aa3-2690-4834-a95e-ade59be5e96c", 3, 0, 0.0, 429.0, 194, 812, 281.0, 812.0, 812.0, 812.0, 0.03413512959970871, 0.028457053028923835, 0.021890040791479874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf9b97d9-d2ca-4663-ae6b-a212551809e5", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 195.64705882352942, 81, 283, 185.0, 281.4, 283.0, 283.0, 0.09356493406424059, 0.1439431582705898, 0.060472143448803466], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 109.47368421052632, 80, 281, 82.0, 239.0, 281.0, 281.0, 0.08470798038341508, 0.06295192682790905, 0.04251943546589389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 97.36842105263159, 79, 241, 81.0, 238.0, 241.0, 241.0, 0.08470949102971075, 0.02936270597781503, 0.04793644614705568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 511.1428571428571, 393, 629, 555.0, 629.0, 629.0, 629.0, 0.05514329378771408, 16.213959303264485, 0.031448909738305685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 621.5714285714286, 549, 712, 563.0, 712.0, 712.0, 712.0, 0.05514242500630199, 49.617250950714485, 0.03139456423698639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 151.42857142857142, 80, 242, 91.0, 242.0, 242.0, 242.0, 0.05534821936871402, 0.09794040380479474, 0.030646914435606302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 82.57142857142857, 82, 84, 82.0, 84.0, 84.0, 84.0, 0.03219604632551123, 0.02392694458370512, 0.01616090606573513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 104.28571428571429, 80, 238, 81.0, 238.0, 238.0, 238.0, 0.032196638670922754, 0.008615116206868003, 0.018362145492010633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 81.57142857142857, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.032196638670922754, 0.00867800026677215, 0.018928102031147948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 103.85714285714286, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.032196638670922754, 0.00867800026677215, 0.018959544061100023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.99999999999999, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.055352596036754124, 0.04113606014059559, 0.031081780001107052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 155.94736842105263, 79, 717, 82.0, 240.0, 717.0, 717.0, 0.0846491071746801, 4.030426098266475, 0.049381546383255516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 486.93333333333334, 80, 799, 558.0, 749.2, 799.0, 799.0, 0.0706637207746628, 42.3952421380722, 0.03749409663499362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 131.52631578947367, 79, 567, 81.0, 241.0, 567.0, 567.0, 0.08464948430643114, 1.3316021724844622, 0.04946443190171749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 388.53333333333336, 80, 644, 550.0, 642.8, 644.0, 644.0, 0.07066305499941114, 13.857871569897538, 0.037562750264986455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51f761ba-3b27-4a1e-97cc-db3200fbc4be", 3, 0, 0.0, 760.0, 283, 1425, 572.0, 1425.0, 1425.0, 1425.0, 0.024265562313964022, 0.024336652828555714, 0.015560923749514689], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 485.0, 84, 1424, 450.0, 1172.6000000000001, 1424.0, 1424.0, 0.09528286305946922, 0.01866576399387649, 0.06478738423132138], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 188.14285714285714, 163, 322, 167.0, 322.0, 322.0, 322.0, 0.03218405601864836, 0.04987900088046382, 0.07238269629975311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 589.7083333333335, 89, 2204, 491.5, 1485.0, 2064.0, 2204.0, 0.11237322895108955, 0.06902613379905793, 0.0508093798870649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.06666666666666, 79, 90, 81.0, 86.4, 90.0, 90.0, 0.07066338788546878, 0.05251449041097826, 0.0354697083721982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 150.5333333333333, 80, 320, 82.0, 274.40000000000003, 320.0, 320.0, 0.07066338788546878, 0.08966337434165277, 0.0363437997588023], "isController": false}, {"data": ["login", 24, 0, 0.0, 2251.833333333333, 1283, 4764, 2093.0, 4051.0, 4598.25, 4764.0, 0.10951902893127681, 38.36372349725062, 0.2182091784932007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 101.8421052631579, 81, 243, 84.0, 242.0, 243.0, 243.0, 0.08471440100230512, 0.06858226409268647, 0.03011332223128815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f020deb8-4085-4712-ab94-b2c177340bc3", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b4c3bf5-170f-4e0a-b44d-30208d064b4b", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 570.7333333333333, 164, 881, 643.0, 831.8000000000001, 881.0, 881.0, 0.07063543638572599, 56.372849555644244, 0.14681225954520197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf9b97d9-d2ca-4663-ae6b-a212551809e5", 3, 0, 0.0, 746.0, 177, 1660, 401.0, 1660.0, 1660.0, 1660.0, 0.0777846919726198, 0.03519554747459033, 0.04988145937046256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b95fc6a-294b-40af-8495-0792b083846a", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03aaa2f8-42f0-482c-8cfc-45f523223fd8", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.7826861213235294, 1.4624502144607845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8318a59d-3022-4dce-b8a8-37353d716f59", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d580dc6e-9a96-46cb-bc54-d5539e002bd4", 1, 0, 0.0, 1424.0, 1424, 1424, 1424.0, 1424.0, 1424.0, 1424.0, 0.7022471910112359, 0.12687083040730338, 0.48416652036516855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 245.28571428571428, 162, 576, 170.0, 325.6, 550.9999999999997, 576.0, 0.11627713825351739, 0.1802068539143868, 0.2615100091775884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 478.0, 80, 794, 641.0, 793.1, 794.0, 794.0, 0.0823158183564275, 57.4548736752298, 0.13088268709699546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e73915a8-70a4-4e1c-b8f1-e3690d05b0e3", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c60e624a-f7bc-4067-ac2a-200f5cc3499d", 3, 0, 0.0, 340.6666666666667, 190, 519, 313.0, 519.0, 519.0, 519.0, 0.0733909044205788, 0.03249076497786041, 0.047063828681165445], "isController": false}, {"data": ["register", 25, 7, 28.0, 727.0399999999998, 104, 1677, 724.0, 1401.0, 1598.6999999999998, 1677.0, 0.10275042333174413, 0.03230216433491706, 0.046358101151626745], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 275.42105263157896, 162, 999, 165.0, 480.0, 999.0, 999.0, 0.08461668641056017, 5.452183291433228, 0.18916543870411773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 109.0, 81, 247, 83.0, 245.0, 247.0, 247.0, 0.06953024298145682, 0.053980999189705246, 0.024715828559814728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 306.45000000000005, 163, 793, 165.0, 776.4000000000003, 792.95, 793.0, 0.11055954184125862, 19.985791155443952, 0.2444078465488839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 122.12499999999999, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.03949096150618527, 0.029348263384967765, 0.019822611537284405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 140.87500000000003, 80, 241, 83.5, 241.0, 241.0, 241.0, 0.03946057395404816, 0.010558786390048043, 0.022504858583168093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e8e569f-6af8-4f65-b224-e33a5ef2e3f9", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 100.625, 79, 242, 80.0, 242.0, 242.0, 242.0, 0.03949174128960281, 0.010644258394463257, 0.0232168244690829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 120.625, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.03946057395404816, 0.010635857823552043, 0.023237037201456093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 0.0333377783704494, 0.00983204010534738, 0.020608216512201627], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 743.7931034482757, 631, 1175, 640.0, 1048.0, 1116.5, 1175.0, 0.25488567498560777, 304.93187988073106, 0.5032996433797841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 727.0399999999998, 104, 1677, 724.0, 1401.0, 1598.6999999999998, 1677.0, 0.10025344069808476, 0.0315171754194604, 0.04523153281495621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59f5639b-ef50-4ce6-bdd7-f5f0dd04a04e", 3, 0, 0.0, 282.3333333333333, 177, 488, 182.0, 488.0, 488.0, 488.0, 0.04619151000046192, 0.02969669018584384, 0.029621508691702464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 80.88888888888887, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.04858640552373446, 0.013095554613819053, 0.028610939971495976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 98.77777777777777, 80, 239, 81.0, 239.0, 239.0, 239.0, 0.04858640552373446, 0.013095554613819053, 0.028563492309851703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 263.8461538461538, 79, 721, 239.0, 718.2, 721.0, 721.0, 0.0690912376366545, 14.360882592396242, 0.03924789205291326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 221.92307692307693, 80, 641, 83.0, 611.0, 641.0, 641.0, 0.06909050324459633, 4.702378955431311, 0.039314946069547566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 81.0, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.048586667818350644, 0.013000729474832107, 0.027709583990153105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 94.61538461538463, 79, 240, 81.0, 180.79999999999995, 240.0, 240.0, 0.06909013605442177, 0.051345306188881806, 0.034680009699192174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 82.0, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.04858614323195024, 0.036107475585463025, 0.024387966426975025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 105.23076923076923, 79, 243, 80.0, 241.8, 243.0, 243.0, 0.06909013605442177, 0.04243396577380953, 0.03806393162733843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 100.8888888888889, 82, 242, 83.0, 242.0, 242.0, 242.0, 0.04810081931728904, 0.0378606058298193, 0.017098338116692587], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 458.1333333333333, 80, 812, 441.0, 681.8000000000001, 812.0, 812.0, 0.0944067167232058, 0.018149937140861116, 0.06424696679086395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df5fd886-653c-4190-ac72-994079ccf235", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1177.625, 763, 2480, 1013.5, 1886.5, 2357.5, 2480.0, 0.11112654535352133, 0.05751666898180303, 0.05111386998194194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 182.0, 162, 321, 165.0, 321.0, 321.0, 321.0, 0.04856438288159464, 0.07526530823544013, 0.10922243532843014], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 830.9444444444443, 408, 1778, 681.0, 1375.0, 1455.5, 1778.0, 0.2579239983951396, 98.20793476761764, 0.9328568456133814], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 140.896551724138, 80, 346, 82.0, 327.2, 329.15, 346.0, 0.2555099847134543, 0.18988583824896363, 0.12351312737613272], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 455.3275862068964, 391, 641, 402.0, 561.0, 597.9999999999999, 641.0, 0.2554762208900263, 75.11849155056447, 0.1284865759359019], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 130.68965517241384, 80, 333, 84.0, 243.0, 252.94999999999976, 333.0, 0.25565076342607285, 0.45238201496879293, 0.12433015643182058], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 601.051724137931, 549, 876, 556.5, 718.5, 797.6999999999999, 876.0, 0.2552940503281409, 229.714035244334, 0.1281456463561176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 100.54999999999998, 81, 251, 83.0, 226.90000000000032, 250.5, 251.0, 0.11237343941386015, 0.08395086049961231, 0.03994524604164559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, 4.819277108433735, 140.0602409638554, 81, 928, 85.0, 255.90000000000003, 310.1000000000001, 854.9700000000014, 0.6831725545714944, 1.6178003875769598, 0.3235247099603266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 84.125, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.03838734753025403, 0.029727701749503364, 0.013645502442394987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8a7e6b7-b60c-4257-9df4-182db56a11a2", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f761ba-3b27-4a1e-97cc-db3200fbc4be", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 91.47619047619045, 81, 243, 83.0, 93.2, 228.1999999999998, 243.0, 0.11621214804320878, 0.09430888185928368, 0.04130978699973437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8318a59d-3022-4dce-b8a8-37353d716f59", 3, 0, 0.0, 293.6666666666667, 200, 409, 272.0, 409.0, 409.0, 409.0, 0.026932157894264345, 0.0270110607005952, 0.01727094760797551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 264.5, 163, 483, 169.0, 483.0, 483.0, 483.0, 0.03944423078819434, 0.06113085377037541, 0.08871099951680816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af575aa3-2690-4834-a95e-ade59be5e96c", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 366.53846153846155, 162, 954, 321.0, 893.5999999999999, 954.0, 954.0, 0.06905930600709717, 19.14823853947536, 0.1512384275860054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df5fd886-653c-4190-ac72-994079ccf235", 3, 0, 0.0, 351.3333333333333, 184, 595, 275.0, 595.0, 595.0, 595.0, 0.07982969664715274, 0.03534127195316658, 0.05119287187333688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b95fc6a-294b-40af-8495-0792b083846a", 3, 0, 0.0, 281.3333333333333, 177, 396, 271.0, 396.0, 396.0, 396.0, 0.01666129802619156, 0.022968944381810307, 0.01068449124726477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c60e624a-f7bc-4067-ac2a-200f5cc3499d", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 106.57142857142857, 82, 244, 84.0, 244.0, 244.0, 244.0, 0.03127080066651478, 0.025926669693233446, 0.011115792424425175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e73915a8-70a4-4e1c-b8f1-e3690d05b0e3", 3, 0, 0.0, 303.6666666666667, 179, 551, 181.0, 551.0, 551.0, 551.0, 0.04692632566870014, 0.030169105857969655, 0.03009272837478492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 83.7333333333333, 82, 86, 84.0, 85.4, 86.0, 86.0, 0.06863449386636407, 0.053285568968515065, 0.0243974177415591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d580dc6e-9a96-46cb-bc54-d5539e002bd4", 3, 0, 0.0, 292.0, 190, 423, 263.0, 423.0, 423.0, 423.0, 0.024873146950552184, 0.02494601749825888, 0.015950553220243427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b4c3bf5-170f-4e0a-b44d-30208d064b4b", 3, 0, 0.0, 301.6666666666667, 185, 414, 306.0, 414.0, 414.0, 414.0, 0.044271294492650964, 0.027539857999822916, 0.028390120491706514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 98.0, 80, 243, 82.0, 225.80000000000032, 242.9, 243.0, 0.11070703044996873, 0.08227348649650995, 0.05556973989383195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 128.35, 79, 242, 81.0, 240.9, 241.95, 242.0, 0.11060968055924254, 0.05451631423657199, 0.061688660710335366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 183.14999999999998, 80, 710, 81.0, 691.7000000000003, 709.85, 710.0, 0.11061029228769736, 14.95444130568537, 0.06360091806542599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=646d7263-bf01-4ae7-8274-65bab0ba3544", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c594906f-27a4-4560-99c3-9649f87cf3cb", 2, 0, 0.0, 226.0, 195, 257, 226.0, 257.0, 257.0, 257.0, 0.0363735564244794, 0.03214655133218151, 0.022609149086114395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 168.6, 79, 570, 81.5, 537.3000000000003, 569.15, 570.0, 0.11070764325569037, 4.908121737584137, 0.06376500780488885], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.532319391634981], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.22813688212927757], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1520912547528517], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.9125475285171103], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 24, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
