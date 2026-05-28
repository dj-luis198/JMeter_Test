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

    var data = {"OkPercent": 96.51515151515152, "KoPercent": 3.484848484848485};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.794996751137102, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4074074074074074, 500, 1500, "see books"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dff18d28-1166-4127-9254-189e48b1106a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5fdd582b-a9a6-44f7-8623-422e776221cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b963473b-874b-4af5-9c96-edd1bc7a4653"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58e19c3d-ef5e-4aea-a79f-6c84d4fbc459"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58e19c3d-ef5e-4aea-a79f-6c84d4fbc459"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5af7ea0-9d7d-4b4b-a4a6-b884f28e74a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10e4137c-0960-4f64-8581-6e9fd6651d11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8579545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10e4137c-0960-4f64-8581-6e9fd6651d11"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9cb8e57-7dc4-47a8-8683-c1aabaa4f275"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8080150d-e0ba-4a61-acc4-3a5b05ae0794"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab8a0e4a-a1d2-4c84-979a-53efc65c1bce"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=738ff6c5-9459-4346-b970-34958c21c8f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5af7ea0-9d7d-4b4b-a4a6-b884f28e74a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab8a0e4a-a1d2-4c84-979a-53efc65c1bce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13de7971-df8a-4d45-aa9d-57031468e8c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b963473b-874b-4af5-9c96-edd1bc7a4653"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/738ff6c5-9459-4346-b970-34958c21c8f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79866308-f339-4f11-adc8-a7c7f252ac57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79866308-f339-4f11-adc8-a7c7f252ac57"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/267f5239-0846-407c-839b-592492f08261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=267f5239-0846-407c-839b-592492f08261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fdd582b-a9a6-44f7-8623-422e776221cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dff18d28-1166-4127-9254-189e48b1106a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13de7971-df8a-4d45-aa9d-57031468e8c5"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 46, 3.484848484848485, 294.687878787879, 77, 2584, 88.5, 797.7000000000003, 1011.95, 1565.3799999999992, 5.197177774977951, 719.3186527928432, 3.8086183578493134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1300.2777777777778, 949, 1710, 1270.5, 1595.0, 1633.75, 1710.0, 0.25023633431574266, 301.11855496626447, 1.2304101008591448], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 385.0, 160, 1093, 239.5, 980.0, 1093.0, 1093.0, 0.08469500722932383, 21.815563435426107, 0.18583748238041367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 93.73684210526316, 80, 255, 83.0, 117.0, 255.0, 255.0, 0.12727418879451247, 0.09881150399573967, 0.045241996798049355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dff18d28-1166-4127-9254-189e48b1106a", 3, 0, 0.0, 259.3333333333333, 171, 419, 188.0, 419.0, 419.0, 419.0, 0.030588523186100575, 0.030678138000122358, 0.019615687069211633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fdd582b-a9a6-44f7-8623-422e776221cb", 3, 0, 0.0, 863.3333333333334, 178, 1933, 479.0, 1933.0, 1933.0, 1933.0, 0.05039899202015959, 0.03240169571608568, 0.032319666106677865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 227.5294117647059, 161, 469, 165.0, 348.1999999999999, 469.0, 469.0, 0.09061109186365696, 0.14042949490978865, 0.20378646929883004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b963473b-874b-4af5-9c96-edd1bc7a4653", 3, 0, 0.0, 741.0, 262, 1534, 427.0, 1534.0, 1534.0, 1534.0, 0.06594131223211343, 0.029836726563358614, 0.042286583690515446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 126.14285714285715, 78, 242, 81.0, 242.0, 242.0, 242.0, 0.03636684798138017, 0.027026534486162414, 0.01825445299065372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 124.28571428571429, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.036368359527211326, 0.009731377451617094, 0.02074133004286271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 79.42857142857142, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.03636854847927512, 0.009802460332304624, 0.02138072869582385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 124.71428571428574, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.036368170577110906, 0.009802358475861925, 0.021416022322263556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 82.66666666666667, 81, 84, 83.0, 84.0, 84.0, 84.0, 0.10661738574170161, 0.03144379931054091, 0.06590703630321984], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 886.5370370370371, 622, 1344, 855.5, 1227.5, 1283.25, 1344.0, 0.2348530646150367, 280.96591341532894, 0.4637430631363322], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 545.7333333333336, 82, 1393, 423.0, 1275.4, 1393.0, 1393.0, 0.0762757112710076, 0.015523299051638656, 0.05111366511148967], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 545.7333333333336, 82, 1393, 423.0, 1275.4, 1393.0, 1393.0, 0.07603714668072509, 0.015474747429944443, 0.05095379887921246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 947.6666666666664, 94, 2274, 911.5, 1724.5, 2202.0, 2274.0, 0.0951339009656091, 0.029311275151025065, 0.04292174047471817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 99.37500000000001, 78, 238, 79.5, 238.0, 238.0, 238.0, 0.03887174752799981, 0.010477150700906197, 0.022890296640023323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 119.0, 77, 279, 80.0, 247.79999999999998, 279.0, 279.0, 0.093474901988816, 0.02501183900872616, 0.05330990504049663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 99.875, 79, 235, 80.5, 235.0, 235.0, 235.0, 0.03887174752799981, 0.010477150700906197, 0.02285233594907801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 100.70588235294119, 79, 248, 82.0, 238.39999999999998, 248.0, 248.0, 0.0934718182467986, 0.06946489617755247, 0.04691847126841257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 126.05882352941177, 78, 238, 81.0, 236.4, 238.0, 238.0, 0.093474901988816, 0.025194407176673064, 0.05504430263599224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 126.05882352941177, 78, 240, 80.0, 237.6, 240.0, 240.0, 0.09347387405220241, 0.02519413011563268, 0.05495241423772056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 104.31578947368422, 77, 240, 79.0, 235.0, 240.0, 240.0, 0.13135335434987003, 0.035403833789613405, 0.07722140558459156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 96.3157894736842, 78, 235, 80.0, 231.0, 235.0, 235.0, 0.13121456343533539, 0.035366425300930246, 0.0772679509292063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 119.87500000000001, 78, 237, 81.5, 237.0, 237.0, 237.0, 0.038871180906475934, 0.010401077703490632, 0.02216872036072456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58e19c3d-ef5e-4aea-a79f-6c84d4fbc459", 3, 0, 0.0, 333.0, 297, 404, 298.0, 404.0, 404.0, 404.0, 0.05683109797681291, 0.025714591857998032, 0.03644442155414109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 90.52631578947367, 78, 235, 80.0, 100.0, 235.0, 235.0, 0.13135244626647954, 0.0976164175867099, 0.065932770879854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 81.125, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.03887136977848178, 0.028887805079516247, 0.01951160553333949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 121.47368421052632, 78, 241, 80.0, 240.0, 241.0, 241.0, 0.1313551705543188, 0.03514777024597984, 0.07491349570675995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 105.375, 80, 254, 85.0, 254.0, 254.0, 254.0, 0.041381522115837226, 0.032571784009145316, 0.014709837939614013], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 422.1428571428571, 79, 853, 415.0, 787.5, 853.0, 853.0, 0.07706704833204887, 0.015358576805570847, 0.05244064289056479], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58e19c3d-ef5e-4aea-a79f-6c84d4fbc459", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1493.181818181818, 821, 2584, 1374.0, 2296.2999999999997, 2562.3999999999996, 2584.0, 0.10065793687832285, 0.0520983462358507, 0.046298719013369204], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 207.40000000000003, 79, 353, 188.0, 346.4, 353.0, 353.0, 0.07613015210804391, 0.12651185758839978, 0.0492020846338901], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 202.87500000000003, 162, 318, 164.5, 318.0, 318.0, 318.0, 0.03885551092568398, 0.06021845296783249, 0.08738695474790059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5af7ea0-9d7d-4b4b-a4a6-b884f28e74a0", 1, 0, 0.0, 1319.0, 1319, 1319, 1319.0, 1319.0, 1319.0, 1319.0, 0.7581501137225171, 0.13697047952994693, 0.5227089651250948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 93.14285714285715, 78, 234, 81.0, 167.5, 234.0, 234.0, 0.08473704279825926, 0.06297352497019071, 0.042534023435844975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 101.99999999999999, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.08473755568467944, 0.049946452674075145, 0.046801894943588995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 569.5555555555555, 460, 636, 617.0, 636.0, 636.0, 636.0, 0.054041071214122736, 15.88986926939474, 0.030820298426804373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 833.2222222222222, 693, 1019, 782.0, 1019.0, 1019.0, 1019.0, 0.05394034198176816, 48.53561453220239, 0.030710175171260585], "isController": false}, {"data": ["addBook", 61, 23, 37.704918032786885, 797.9180327868852, 407, 1617, 635.0, 1471.0, 1577.8999999999999, 1617.0, 0.2855016638662542, 73.93805209908078, 1.0386640482029776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 168.66666666666666, 79, 241, 235.0, 241.0, 241.0, 241.0, 0.054167268525205835, 0.09585067438249315, 0.02999300903690597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 90.8235294117647, 79, 237, 81.0, 128.1999999999999, 237.0, 237.0, 0.09129232338963027, 0.0678451739253014, 0.045824467013935506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 117.05882352941175, 77, 402, 79.0, 272.39999999999986, 402.0, 402.0, 0.09129330390466832, 0.03249387126570111, 0.051614699967241814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 157.58823529411765, 79, 774, 80.0, 345.1999999999996, 774.0, 774.0, 0.09129281364451652, 4.855243203048643, 0.05320869067309655], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 134.8333333333333, 78, 360, 81.5, 320.5, 323.25, 360.0, 0.23573683038735052, 0.1751911405515369, 0.11395481547044778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 140.1764705882353, 78, 791, 80.0, 349.39999999999964, 791.0, 791.0, 0.09129281364451652, 1.6021658045313456, 0.05329784381142127], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 503.70370370370375, 385, 779, 467.0, 691.0, 714.5, 779.0, 0.2356658432909426, 69.29358276999014, 0.11852334892073772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 98.11111111111113, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.054167594537499024, 0.04025540961234058, 0.03041637388580267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10e4137c-0960-4f64-8581-6e9fd6651d11", 3, 0, 0.0, 567.0, 216, 923, 562.0, 923.0, 923.0, 923.0, 0.020670267886671808, 0.020730825312121046, 0.013255347570554514], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 137.5740740740741, 78, 327, 83.0, 240.5, 242.25, 327.0, 0.23590160282033473, 0.41743525811567045, 0.1147255841841081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 536.1875, 77, 1016, 738.5, 1016.0, 1016.0, 1016.0, 0.0783772000724989, 39.67895983199112, 0.042288479531304345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 257.0, 78, 1012, 80.0, 898.0, 1012.0, 1012.0, 0.08473806857730835, 16.356687450821656, 0.048256249432557574], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 745.0925925925926, 539, 1018, 762.5, 915.0, 954.75, 1018.0, 0.23525926442269993, 211.68669966922113, 0.11808912296217554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 390.87499999999994, 77, 708, 539.0, 654.1, 708.0, 708.0, 0.07837681613778645, 12.972271981635332, 0.04236481223853984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 235.3571428571429, 78, 709, 80.5, 666.5, 709.0, 709.0, 0.08473755568467944, 5.357014170086432, 0.04833870887202208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.47058823529414, 80, 237, 83.0, 120.9999999999999, 237.0, 237.0, 0.08740270022930355, 0.06529596257364963, 0.031068928597135247], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 447.35714285714283, 81, 1319, 384.5, 1170.0, 1319.0, 1319.0, 0.0757338064893053, 0.015536629805039543, 0.05105798268130132], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 23, 13.068181818181818, 139.1477272727273, 79, 1249, 86.0, 243.10000000000008, 334.35000000000025, 1208.1899999999994, 0.7278562153131022, 1.5447155338370429, 0.34994236727996825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 110.28571428571428, 81, 236, 88.0, 236.0, 236.0, 236.0, 0.03653292138115319, 0.02829160806177195, 0.012986311897206797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10e4137c-0960-4f64-8581-6e9fd6651d11", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 260.17647058823536, 159, 892, 164.0, 558.3999999999997, 892.0, 892.0, 0.09125312005153118, 6.55489697120159, 0.2038569959607075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9cb8e57-7dc4-47a8-8683-c1aabaa4f275", 2, 0, 0.0, 186.5, 169, 204, 186.5, 204.0, 204.0, 204.0, 0.01638941243956404, 0.02800924977464558, 0.010187364275178235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8080150d-e0ba-4a61-acc4-3a5b05ae0794", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 82.58823529411767, 79, 88, 82.0, 86.4, 88.0, 88.0, 0.09572718877401626, 0.07768485729610108, 0.03402802413451359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 522.6363636363637, 91, 1776, 437.5, 1229.6999999999996, 1721.999999999999, 1776.0, 0.10293023669275793, 0.06322570203100071, 0.04653974569213566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 84.00000000000001, 80, 103, 81.0, 97.4, 103.0, 103.0, 0.07837182532879429, 0.05824312409688717, 0.03933898263574245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 119.1875, 78, 240, 80.0, 240.0, 240.0, 240.0, 0.0783764322068354, 0.08718804036876111, 0.04099646142654904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab8a0e4a-a1d2-4c84-979a-53efc65c1bce", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["login", 22, 0, 0.0, 2772.0000000000005, 1872, 4102, 2806.5, 3644.7, 4046.0499999999993, 4102.0, 0.10015660851513275, 49.1504018285979, 0.21905701414939724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=738ff6c5-9459-4346-b970-34958c21c8f6", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 252.28571428571428, 159, 480, 163.0, 480.0, 480.0, 480.0, 0.036351550653289294, 0.05633780360036144, 0.08175548940871606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5af7ea0-9d7d-4b4b-a4a6-b884f28e74a0", 3, 0, 0.0, 686.0, 289, 1358, 411.0, 1358.0, 1358.0, 1358.0, 0.02226890444413103, 0.02632109115776034, 0.014280514894185588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 88.78571428571429, 80, 122, 86.5, 109.0, 122.0, 122.0, 0.08265097085372548, 0.06691177230247894, 0.029379837295660235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 221.42105263157893, 159, 472, 164.0, 328.0, 472.0, 472.0, 0.13114029941400993, 0.20324185075198606, 0.2949376069828758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab8a0e4a-a1d2-4c84-979a-53efc65c1bce", 3, 0, 0.0, 396.0, 188, 574, 426.0, 574.0, 574.0, 574.0, 0.06372944725326082, 0.028835915261078305, 0.04086816767217572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13de7971-df8a-4d45-aa9d-57031468e8c5", 3, 0, 0.0, 419.33333333333337, 194, 722, 342.0, 722.0, 722.0, 722.0, 0.022553338645897546, 0.0226194128802117, 0.01446291573320904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 91.94117647058823, 81, 239, 83.0, 116.5999999999999, 239.0, 239.0, 0.09297746663749727, 0.0770877628664406, 0.03305058384379785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b963473b-874b-4af5-9c96-edd1bc7a4653", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 631.5625000000001, 160, 1099, 821.5, 1097.6, 1099.0, 1099.0, 0.07834112664332754, 52.772431459164686, 0.16491610460988565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/738ff6c5-9459-4346-b970-34958c21c8f6", 3, 0, 0.0, 338.6666666666667, 183, 422, 411.0, 422.0, 422.0, 422.0, 0.029265437518290898, 0.029351176104770265, 0.01876722392937274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79866308-f339-4f11-adc8-a7c7f252ac57", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 88.81249999999999, 81, 112, 85.0, 109.9, 112.0, 112.0, 0.07560043281247786, 0.05869369539640614, 0.026873591351310486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79866308-f339-4f11-adc8-a7c7f252ac57", 3, 0, 0.0, 310.0, 178, 399, 353.0, 399.0, 399.0, 399.0, 0.03329855484271983, 0.027434453875951784, 0.021353565442759785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/267f5239-0846-407c-839b-592492f08261", 3, 0, 0.0, 450.33333333333337, 173, 853, 325.0, 853.0, 853.0, 853.0, 0.03995152548241467, 0.032915791339840995, 0.025619956119907847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 267.29411764705884, 161, 484, 316.0, 475.2, 484.0, 484.0, 0.0934307211202893, 0.14479936954872963, 0.2101278815820569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 591.5333333333335, 79, 1176, 811.0, 1129.2, 1176.0, 1176.0, 0.08397997917296517, 60.29053923544627, 0.13587698192750847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=267f5239-0846-407c-839b-592492f08261", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 90.99999999999999, 78, 232, 81.0, 125.59999999999991, 232.0, 232.0, 0.09065022875851846, 0.06736799227073491, 0.04550216560730321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 107.29411764705883, 77, 237, 80.0, 236.2, 237.0, 237.0, 0.09065119552929633, 0.024256276928737493, 0.051699509950301814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fdd582b-a9a6-44f7-8623-422e776221cb", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 107.29411764705884, 78, 238, 80.0, 235.6, 238.0, 238.0, 0.09065071214132979, 0.024433199756842796, 0.05329270381746146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dff18d28-1166-4127-9254-189e48b1106a", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13de7971-df8a-4d45-aa9d-57031468e8c5", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 947.6666666666664, 94, 2274, 911.5, 1724.5, 2202.0, 2274.0, 0.09579958726344487, 0.02951637673986021, 0.04322207940987454], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 116.82352941176472, 78, 238, 81.0, 236.4, 238.0, 238.0, 0.09065022875851846, 0.02443306947006943, 0.05338094525526038], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 23.91304347826087, 0.8333333333333334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 6.521739130434782, 0.22727272727272727], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.521739130434782, 0.22727272727272727], "isController": false}, {"data": ["401/Unauthorized", 29, 63.04347826086956, 2.196969696969697], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 46, "401/Unauthorized", 29, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 23, "401/Unauthorized", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
