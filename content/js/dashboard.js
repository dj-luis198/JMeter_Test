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

    var data = {"OkPercent": 98.06259314456035, "KoPercent": 1.9374068554396424};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.805448717948718, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30701754385964913, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb26ddc7-91ff-4793-8710-c91c15cea120"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bcb83c7f-08d5-4ec7-bd71-0ff63f3172b8"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bab850e8-cc96-470c-99c9-4e4edb56cfaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2432f3a-2cc3-4258-a011-b18442b4ca8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb26ece7-8f84-4d24-9f66-4a653dd577cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70ecc90a-6da5-4e8d-87ad-56314206c9d9"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d6144c6-3556-4ab5-beab-33b6a18bb054"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68f9fed5-ca33-4935-abe3-5b0895211b79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfd50047-c0e1-41cb-a375-582ab0c2ca5b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ffc9a8b5-0233-4f51-a361-2f1fb7ff1a22"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b30198a-808c-48b0-91c7-2e7b8d7ce142"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/93d170b9-b2de-42fb-8540-41661339e047"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb26ddc7-91ff-4793-8710-c91c15cea120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8570aff6-6321-43e7-a51f-97334e255a0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2432f3a-2cc3-4258-a011-b18442b4ca8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffc9a8b5-0233-4f51-a361-2f1fb7ff1a22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb26ece7-8f84-4d24-9f66-4a653dd577cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcb83c7f-08d5-4ec7-bd71-0ff63f3172b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93d170b9-b2de-42fb-8540-41661339e047"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d6144c6-3556-4ab5-beab-33b6a18bb054"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6754385964912281, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9301675977653632, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70ecc90a-6da5-4e8d-87ad-56314206c9d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b30198a-808c-48b0-91c7-2e7b8d7ce142"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68f9fed5-ca33-4935-abe3-5b0895211b79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cfd50047-c0e1-41cb-a375-582ab0c2ca5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70ec9dfd-d79b-43a4-b14d-4cccd2cfc5bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8570aff6-6321-43e7-a51f-97334e255a0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 26, 1.9374068554396424, 316.06259314456037, 96, 2803, 112.0, 807.4000000000001, 1001.6999999999998, 1385.2699999999993, 5.22658939726753, 730.2318775704538, 3.831700602255378], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1464.8596491228068, 1196, 1858, 1428.0, 1718.2, 1836.3, 1858.0, 0.2497294597519354, 300.5085704850447, 1.227917802588862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cb26ddc7-91ff-4793-8710-c91c15cea120", 3, 0, 0.0, 274.6666666666667, 196, 404, 224.0, 404.0, 404.0, 404.0, 0.019222636576832878, 0.026487441611241398, 0.012327016294388272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcb83c7f-08d5-4ec7-bd71-0ff63f3172b8", 3, 0, 0.0, 354.6666666666667, 241, 547, 276.0, 547.0, 547.0, 547.0, 0.061173303970147426, 0.027679326991700823, 0.03922897422564793], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 513.5714285714286, 104, 1053, 491.0, 936.0, 1053.0, 1053.0, 0.07741478843644246, 0.01524967651677689, 0.05208866136006724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 513.5714285714286, 104, 1053, 491.0, 936.0, 1053.0, 1053.0, 0.0762290574277049, 0.015016103388381602, 0.051290840398133475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 129.5, 97, 308, 101.0, 300.5, 308.0, 308.0, 0.09304303905149268, 0.02489628193370019, 0.05306360820905442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 102.42857142857142, 97, 104, 103.0, 104.0, 104.0, 104.0, 0.09304303905149268, 0.06914624288885345, 0.04670324421139379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 115.5, 99, 301, 101.0, 204.0, 301.0, 301.0, 0.09304427578323342, 0.02507833995719963, 0.05479072099344702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 157.57142857142856, 99, 304, 102.0, 303.0, 304.0, 304.0, 0.0930436574132534, 0.025078173287165953, 0.05469949390896342], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 210.78571428571425, 99, 423, 201.5, 349.5, 423.0, 423.0, 0.07750993788132121, 0.16441125146715238, 0.050098150419107305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bab850e8-cc96-470c-99c9-4e4edb56cfaa", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 135.9333333333333, 98, 408, 103.0, 341.40000000000003, 408.0, 408.0, 0.08913026685601896, 0.06623841120842816, 0.04473921598046264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 169.0666666666667, 99, 304, 103.0, 304.0, 304.0, 304.0, 0.089133444651102, 0.0417000607592981, 0.04983580876716561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 627.5714285714286, 478, 733, 688.0, 733.0, 733.0, 733.0, 0.06196061075459173, 18.21847684775393, 0.0353369108209781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 744.2857142857142, 675, 894, 699.0, 894.0, 894.0, 894.0, 0.061742006615215, 55.55556608324146, 0.03515194321940463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 277.85714285714283, 100, 351, 297.0, 351.0, 351.0, 351.0, 0.06206994395970774, 0.10983470552245159, 0.034368806860502234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 114.58823529411764, 98, 305, 102.0, 148.99999999999986, 305.0, 305.0, 0.08921917477511519, 0.06630448437877214, 0.04478384358829025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2432f3a-2cc3-4258-a011-b18442b4ca8d", 3, 0, 0.0, 286.6666666666667, 211, 413, 236.0, 413.0, 413.0, 413.0, 0.020842017507294704, 0.028732403692510768, 0.013365486487425316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 148.82352941176467, 97, 311, 102.0, 304.6, 311.0, 311.0, 0.08922057951390529, 0.031756129978639545, 0.05044283913004687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 170.70588235294116, 99, 662, 102.0, 382.7999999999997, 662.0, 662.0, 0.08922011126272698, 4.745010275073476, 0.05200064618977643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 149.58823529411762, 97, 705, 102.0, 377.7999999999997, 705.0, 705.0, 0.08922011126272698, 1.5657904016217068, 0.052087775204681434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb26ece7-8f84-4d24-9f66-4a653dd577cf", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 108.42857142857143, 99, 142, 101.0, 142.0, 142.0, 142.0, 0.06217745445501461, 0.04620804964869738, 0.034914097960579496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 498.16666666666663, 98, 908, 682.0, 905.3, 908.0, 908.0, 0.08307487815684537, 41.5382413423285, 0.0448726935183134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 228.26666666666674, 97, 1028, 102.0, 823.4000000000001, 1028.0, 1028.0, 0.089133444651102, 10.714478372512433, 0.05137939576437871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 441.3888888888889, 100, 809, 630.0, 715.4000000000001, 809.0, 809.0, 0.0829971181556196, 13.567669308357349, 0.044911743515850144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 168.20000000000002, 98, 697, 101.0, 583.6, 697.0, 697.0, 0.08913397430564633, 3.5152675356238783, 0.05146674597114436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70ecc90a-6da5-4e8d-87ad-56314206c9d9", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 421.7142857142857, 101, 1069, 385.5, 870.0, 1069.0, 1069.0, 0.07644550254727336, 0.015058740178118021, 0.05192705802213644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d6144c6-3556-4ab5-beab-33b6a18bb054", 3, 0, 0.0, 291.0, 200, 396, 277.0, 396.0, 396.0, 396.0, 0.018290340870986032, 0.025214711454630813, 0.011729157394479977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 313.11764705882354, 203, 803, 207.0, 645.3999999999999, 803.0, 803.0, 0.08917143996139401, 6.405365661914353, 0.1992065790819538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 543.4285714285714, 194, 1300, 553.0, 860.6, 1256.1999999999994, 1300.0, 0.0840504302581549, 0.05162863343005804, 0.038003270712427456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 102.16666666666667, 97, 105, 103.0, 105.0, 105.0, 105.0, 0.08307372793354102, 0.06173740913811007, 0.0416991173416407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 156.33333333333331, 97, 304, 102.0, 301.3, 304.0, 304.0, 0.08307602841200172, 0.0915494948515939, 0.04350313727390628], "isController": false}, {"data": ["login", 21, 0, 0.0, 2277.904761904762, 1490, 3640, 2233.0, 3252.2000000000003, 3613.7, 3640.0, 0.08809796493700996, 35.25039896448184, 0.18161601951369924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68f9fed5-ca33-4935-abe3-5b0895211b79", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 118.33333333333333, 103, 305, 105.0, 187.40000000000006, 305.0, 305.0, 0.08474145382438181, 0.06860416525430911, 0.030122938664135724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfd50047-c0e1-41cb-a375-582ab0c2ca5b", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc9a8b5-0233-4f51-a361-2f1fb7ff1a22", 3, 0, 0.0, 553.0, 209, 898, 552.0, 898.0, 898.0, 898.0, 0.03174502396749309, 0.03183802696739786, 0.020357323312487435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 614.1111111111111, 204, 1011, 790.5, 1009.2, 1011.0, 1011.0, 0.08295695455802378, 55.19345100930962, 0.17478029369066275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b30198a-808c-48b0-91c7-2e7b8d7ce142", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93d170b9-b2de-42fb-8540-41661339e047", 3, 0, 0.0, 680.0, 260, 1177, 603.0, 1177.0, 1177.0, 1177.0, 0.06988120195667365, 0.03161942406242721, 0.0448131405776846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb26ddc7-91ff-4793-8710-c91c15cea120", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8570aff6-6321-43e7-a51f-97334e255a0a", 3, 0, 0.0, 348.0, 215, 423, 406.0, 423.0, 423.0, 423.0, 0.03592642268633838, 0.02995038037100019, 0.023038754131538608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 290.85714285714283, 205, 412, 209.5, 409.5, 412.0, 412.0, 0.09297939178195004, 0.14409989722456515, 0.20911283132210054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 602.2727272727273, 99, 995, 804.0, 987.6, 995.0, 995.0, 0.09693765146508042, 73.8092435007711, 0.16245490471469487], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 917.8695652173911, 199, 1636, 886.0, 1559.8000000000002, 1633.0, 1636.0, 0.09097057695122, 0.028242903306187186, 0.04104336577291371], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 106.37499999999999, 100, 124, 105.0, 115.60000000000001, 124.0, 124.0, 0.08869818778515082, 0.06886236258710439, 0.03152943393925283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 394.26666666666665, 204, 1131, 209.0, 1049.4, 1131.0, 1131.0, 0.08907627898690579, 14.32847040255055, 0.1972958390243178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2432f3a-2cc3-4258-a011-b18442b4ca8d", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 286.11764705882354, 201, 407, 206.0, 405.4, 407.0, 407.0, 0.13136441260789267, 0.20358918243039617, 0.29544164280857116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 101.38461538461539, 98, 103, 102.0, 103.0, 103.0, 103.0, 0.07330675493551825, 0.05447894580657167, 0.03679655472349256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffc9a8b5-0233-4f51-a361-2f1fb7ff1a22", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 116.53846153846155, 98, 288, 102.0, 217.99999999999994, 288.0, 288.0, 0.07330799508272526, 0.019615615871744842, 0.04180846594561675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 130.84615384615384, 99, 300, 101.0, 297.6, 300.0, 300.0, 0.07322582280477433, 0.019736647552849332, 0.043048774734838036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb26ece7-8f84-4d24-9f66-4a653dd577cf", 3, 0, 0.0, 414.33333333333337, 200, 737, 306.0, 737.0, 737.0, 737.0, 0.07770209018622601, 0.03515817231733533, 0.04982848882384936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 101.0, 96, 109, 101.0, 106.6, 109.0, 109.0, 0.07330758169566075, 0.019758684128908563, 0.04316842945555023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 105.5, 101, 110, 105.5, 110.0, 110.0, 110.0, 0.06599571027883187, 0.01946357861738987, 0.04079617637353572], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 981.5614035087721, 769, 1434, 818.0, 1284.8, 1416.0, 1434.0, 0.2544756462342069, 304.44134294499753, 0.5024899967632483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 917.8695652173911, 199, 1636, 886.0, 1559.8000000000002, 1633.0, 1636.0, 0.0908835860292171, 0.028215895934342535, 0.04100411791552568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.0, 98, 103, 101.5, 103.0, 103.0, 103.0, 0.043725404459991256, 0.011785362920857018, 0.025748455946655004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 125.75, 100, 297, 101.0, 297.0, 297.0, 297.0, 0.04372516547242308, 0.011785298506239033, 0.025705614857811226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcb83c7f-08d5-4ec7-bd71-0ff63f3172b8", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93d170b9-b2de-42fb-8540-41661339e047", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 225.0, 98, 901, 102.5, 481.7000000000004, 901.0, 901.0, 0.08652390222799047, 4.887760796898659, 0.05040186296776985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 161.25, 98, 683, 101.0, 412.8000000000003, 683.0, 683.0, 0.08652437012962433, 1.6119283138833758, 0.05048663198481497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.875, 97, 103, 101.5, 103.0, 103.0, 103.0, 0.043725882442965054, 0.011700089638059009, 0.024937417330753508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 126.9375, 99, 305, 103.0, 300.1, 305.0, 305.0, 0.0865234343314172, 0.06430110695918798, 0.04343070824838715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 102.0, 100, 104, 102.0, 104.0, 104.0, 104.0, 0.04372373160187356, 0.03249390600490799, 0.02194726371422169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 125.1875, 98, 299, 101.0, 297.6, 299.0, 299.0, 0.08652390222799047, 0.031274081359506815, 0.04889149699870214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 105.875, 101, 113, 104.0, 113.0, 113.0, 113.0, 0.042215690516772826, 0.03322836577785049, 0.015006358738384091], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 501.92857142857133, 101, 1177, 412.5, 957.0, 1177.0, 1177.0, 0.07384628368577352, 0.014258266827721895, 0.05025420923817009], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1189.285714285714, 610, 2803, 1161.0, 1510.8000000000002, 2676.7999999999984, 2803.0, 0.08642722210561407, 0.04473283956638228, 0.03975314610521897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 229.5, 202, 398, 206.0, 398.0, 398.0, 398.0, 0.04369960888850045, 0.06772585869731465, 0.09828144459982083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d6144c6-3556-4ab5-beab-33b6a18bb054", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 977.5245901639342, 511, 2759, 827.0, 1592.4, 1790.4999999999998, 2759.0, 0.2905758164704089, 80.89941663034469, 1.058742833852559], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 191.22807017543855, 98, 536, 105.0, 403.4, 420.1999999999995, 536.0, 0.2552562638543696, 0.1896972820245852, 0.12339047910928998], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 596.4035087719296, 476, 913, 506.0, 710.4, 812.4, 913.0, 0.2552082633749278, 75.03970314409864, 0.12835181214657013], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 161.15789473684214, 98, 409, 104.0, 303.0, 307.1, 409.0, 0.25564665147736854, 0.4523747387470623, 0.12432815667551712], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 785.8596491228068, 667, 1026, 707.0, 932.4000000000002, 1011.1, 1026.0, 0.2549833589807823, 229.4344746238436, 0.12798969386340048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.47058823529409, 100, 313, 111.0, 168.19999999999987, 313.0, 313.0, 0.13815746700474613, 0.10321334204944412, 0.049110662099343345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 172.8268156424581, 98, 1550, 107.0, 299.0, 429.0, 1162.7999999999945, 0.7389701480830123, 1.5617807684051042, 0.35597529223379526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 121.23076923076924, 101, 306, 105.0, 229.19999999999993, 306.0, 306.0, 0.07682170863298723, 0.059491811470662966, 0.02730771674063218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70ecc90a-6da5-4e8d-87ad-56314206c9d9", 3, 0, 0.0, 302.6666666666667, 179, 387, 342.0, 387.0, 387.0, 387.0, 0.02744965276189256, 0.02753007166646842, 0.017602804668270945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 122.85714285714286, 98, 312, 105.5, 232.5, 312.0, 312.0, 0.09965831435079726, 0.08087505783741458, 0.035425416429384966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b30198a-808c-48b0-91c7-2e7b8d7ce142", 3, 0, 0.0, 384.33333333333337, 203, 697, 253.0, 697.0, 697.0, 697.0, 0.023738121048591937, 0.028057655445129333, 0.015222688302645218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68f9fed5-ca33-4935-abe3-5b0895211b79", 3, 0, 0.0, 528.6666666666666, 204, 887, 495.0, 887.0, 887.0, 887.0, 0.01762518286127219, 0.024297737440588444, 0.011302607498927801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 249.23076923076923, 202, 404, 205.0, 400.8, 404.0, 404.0, 0.07318253977189565, 0.11341864318163906, 0.1645892471627692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 365.0625, 202, 1199, 301.0, 783.2000000000004, 1199.0, 1199.0, 0.08647667021581334, 6.591655685368148, 0.1931051914377287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfd50047-c0e1-41cb-a375-582ab0c2ca5b", 3, 0, 0.0, 322.0, 191, 412, 363.0, 412.0, 412.0, 412.0, 0.031562667676672033, 0.02612755986385969, 0.020240382592136685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 108.11764705882354, 101, 155, 105.0, 126.19999999999997, 155.0, 155.0, 0.08809933459090814, 0.07304329596453224, 0.03131656034286188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70ec9dfd-d79b-43a4-b14d-4cccd2cfc5bd", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8570aff6-6321-43e7-a51f-97334e255a0a", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 142.05555555555557, 102, 332, 107.5, 316.70000000000005, 332.0, 332.0, 0.08431624211877349, 0.06546036375432121, 0.02997178919065776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 102.00000000000001, 96, 107, 102.0, 104.6, 107.0, 107.0, 0.1314680339342196, 0.09770231818744249, 0.06599079047088756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 147.41176470588232, 99, 304, 102.0, 301.6, 304.0, 304.0, 0.13146905063878492, 0.035178242065456125, 0.07497844294243203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 135.94117647058823, 96, 303, 100.0, 301.4, 303.0, 303.0, 0.13146905063878492, 0.035435017554985, 0.07728942234819192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 158.8235294117647, 98, 303, 101.0, 302.2, 303.0, 303.0, 0.1314680339342196, 0.03543474352133262, 0.07741721138899844], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.6706408345752608], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.14903129657228018], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14903129657228018], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 0.9687034277198212], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 26, "401/Unauthorized", 13, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
