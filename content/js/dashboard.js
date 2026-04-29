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

    var data = {"OkPercent": 96.77914110429448, "KoPercent": 3.2208588957055215};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.759514435695538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09090909090909091, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/add82b05-7453-42c9-9f3b-c198a6e7ee15"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7ec937a-34d9-4e65-837e-fcbeb12156b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0dfbe6b-d16d-47cc-9bb6-f52e1889d94b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9caf71c4-0b46-4785-af00-af1206bdd927"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b157b50c-1c5c-4cb7-92ce-0a4a16813967"], "isController": false}, {"data": [0.76, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44f7d9cc-1fd2-4665-ad63-bf8c01fe454b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2315aef4-e843-449c-9ca0-83ebfc3f9efe"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8197a16c-10fb-4c0a-ac91-23b74ac5022a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d44ffc9-fa9f-468c-9b32-cc416d256ac3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfd76707-5fa6-4744-b22c-b317fcec8051"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84a80856-a7d8-4b82-befb-b8874564b689"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=690735fd-0c21-4760-8f6d-26c00a18c56d"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7ec937a-34d9-4e65-837e-fcbeb12156b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0dfbe6b-d16d-47cc-9bb6-f52e1889d94b"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=add82b05-7453-42c9-9f3b-c198a6e7ee15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42727272727272725, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5363636363636364, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b157b50c-1c5c-4cb7-92ce-0a4a16813967"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8757575757575757, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9caf71c4-0b46-4785-af00-af1206bdd927"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2315aef4-e843-449c-9ca0-83ebfc3f9efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfd76707-5fa6-4744-b22c-b317fcec8051"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44f7d9cc-1fd2-4665-ad63-bf8c01fe454b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf21737-bb3b-46fc-8528-9162b81326ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8197a16c-10fb-4c0a-ac91-23b74ac5022a"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d44ffc9-fa9f-468c-9b32-cc416d256ac3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/670fac44-a5d4-4ee1-a7b8-8d5ea1a73c3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84a80856-a7d8-4b82-befb-b8874564b689"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/690735fd-0c21-4760-8f6d-26c00a18c56d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 42, 3.2208588957055215, 365.6687116564412, 97, 2626, 118.0, 1015.5, 1209.75, 1607.7500000000011, 5.128568169840558, 737.275609011325, 3.7581805381850217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1723.7818181818172, 1332, 2599, 1688.0, 2012.1999999999998, 2207.9999999999995, 2599.0, 0.24921384360245408, 299.8885051247429, 1.2253825220101136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/add82b05-7453-42c9-9f3b-c198a6e7ee15", 3, 0, 0.0, 1113.6666666666665, 191, 2626, 524.0, 2626.0, 2626.0, 2626.0, 0.02426929206475047, 0.02434039350634642, 0.015563315549335426], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 437.0666666666666, 103, 740, 486.0, 657.2, 740.0, 740.0, 0.09626121443148127, 0.01959066121828193, 0.06450629428015864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 437.0666666666666, 103, 740, 486.0, 657.2, 740.0, 740.0, 0.09560899744405281, 0.019457924870449807, 0.06406923246690335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 179.82352941176467, 100, 408, 104.0, 327.99999999999994, 408.0, 408.0, 0.09525517179550395, 0.04231982414214313, 0.053384045038886524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7ec937a-34d9-4e65-837e-fcbeb12156b4", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 150.05882352941177, 99, 305, 104.0, 304.2, 305.0, 305.0, 0.09525196947454531, 0.07078784059582909, 0.04781202374015263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 219.2941176470588, 98, 806, 105.0, 626.7999999999998, 806.0, 806.0, 0.09514801112672036, 3.3140017294550255, 0.055067567331210224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 283.11764705882354, 98, 1383, 105.0, 994.9999999999997, 1383.0, 1383.0, 0.09515280420911228, 10.095412987658122, 0.05497741870032464], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 200.4666666666667, 100, 337, 195.0, 298.0, 337.0, 337.0, 0.09682416731216112, 0.15781204613671573, 0.06257640031951976], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 113.25, 99, 310, 103.0, 108.80000000000001, 299.9499999999998, 310.0, 0.09019775858569914, 0.06703173269894243, 0.045275046790087266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 114.1, 99, 308, 102.5, 131.20000000000005, 299.29999999999984, 308.0, 0.09019857215660275, 0.030908866181398348, 0.05106260964763928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 680.1818181818182, 498, 811, 709.0, 810.8, 811.0, 811.0, 0.05147065704633295, 15.134082158281629, 0.02935435909673676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1068.6363636363635, 913, 1276, 1076.0, 1264.0, 1276.0, 1276.0, 0.051412920534320464, 46.26143627105593, 0.02927122331202034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 139.45454545454547, 100, 307, 103.0, 304.6, 307.0, 307.0, 0.0516400407486867, 0.09137866585607451, 0.028593655375493514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 140.1818181818182, 101, 316, 102.0, 314.0, 316.0, 316.0, 0.05487269534679543, 0.040779415194249345, 0.027543520906496928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 193.54545454545453, 99, 305, 113.0, 304.6, 305.0, 305.0, 0.05481991657405423, 0.014668610489541854, 0.031264483671140306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 156.09090909090907, 99, 304, 103.0, 303.8, 304.0, 304.0, 0.05487351654436524, 0.014790127506098443, 0.032259625937214716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0dfbe6b-d16d-47cc-9bb6-f52e1889d94b", 3, 0, 0.0, 299.0, 193, 495, 209.0, 495.0, 495.0, 495.0, 0.0189490838117977, 0.022397175560103337, 0.012151593460039542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 211.45454545454544, 97, 306, 299.0, 305.8, 306.0, 306.0, 0.0548185505975222, 0.014775312465738405, 0.03228084571318934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 120.72727272727272, 101, 307, 102.0, 266.20000000000016, 307.0, 307.0, 0.05163979832311492, 0.038376842308486765, 0.02899695706620222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 200.05, 101, 1114, 104.0, 398.60000000000025, 1078.7499999999995, 1114.0, 0.09019694502947184, 4.0810638349147865, 0.05263837338829334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 784.0714285714287, 101, 1364, 1083.0, 1285.5, 1364.0, 1364.0, 0.06851125052606853, 39.63651589246914, 0.03649218115353371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 176.64999999999998, 99, 604, 103.0, 306.7, 589.1499999999999, 604.0, 0.09019775858569914, 1.349152352470291, 0.0527269319232417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 559.4285714285714, 101, 915, 693.0, 908.0, 915.0, 915.0, 0.06851359750219, 12.957127539896936, 0.03656033906890021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9caf71c4-0b46-4785-af00-af1206bdd927", 3, 0, 0.0, 706.6666666666667, 183, 1370, 567.0, 1370.0, 1370.0, 1370.0, 0.060068478064994095, 0.027179422041126885, 0.038520475842460405], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 476.5333333333334, 105, 1242, 423.0, 1202.4, 1242.0, 1242.0, 0.0951191208456724, 0.019358227328357545, 0.06422398452411904], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 372.7272727272727, 205, 621, 405.0, 619.4, 621.0, 621.0, 0.054789335006898476, 0.0849127682186991, 0.1232224985555539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b157b50c-1c5c-4cb7-92ce-0a4a16813967", 3, 0, 0.0, 347.0, 187, 500, 354.0, 500.0, 500.0, 500.0, 0.025831783426327755, 0.025907462479334575, 0.016565303824826065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 485.72, 106, 1198, 447.0, 979.8000000000005, 1178.8, 1198.0, 0.10770987268693048, 0.06616163078132742, 0.048700850638719546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 104.42857142857143, 101, 113, 104.0, 109.5, 113.0, 113.0, 0.06851225635328834, 0.0509158467625512, 0.03438994117733419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 174.57142857142858, 99, 311, 104.0, 310.0, 311.0, 311.0, 0.06851259163559131, 0.08448420723590842, 0.03537459565336543], "isController": false}, {"data": ["login", 25, 0, 0.0, 2632.48, 1553, 4182, 2527.0, 3594.2, 4007.0999999999995, 4182.0, 0.10478577595962814, 55.295834640972494, 0.23455231718025668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44f7d9cc-1fd2-4665-ad63-bf8c01fe454b", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 115.95, 102, 310, 105.5, 117.10000000000002, 300.39999999999986, 310.0, 0.09277341485024052, 0.07510660245200135, 0.032978049810046435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2315aef4-e843-449c-9ca0-83ebfc3f9efe", 3, 0, 0.0, 327.3333333333333, 227, 487, 268.0, 487.0, 487.0, 487.0, 0.06891798759476223, 0.031991227314495746, 0.04419545428440156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8197a16c-10fb-4c0a-ac91-23b74ac5022a", 3, 0, 0.0, 913.0, 195, 2061, 483.0, 2061.0, 2061.0, 2061.0, 0.0451222813825467, 0.029009279209156812, 0.028935837995969074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d44ffc9-fa9f-468c-9b32-cc416d256ac3", 1, 0, 0.0, 847.0, 847, 847, 847.0, 847.0, 847.0, 847.0, 1.1806375442739079, 0.21329877508854783, 0.8139942443919717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 904.5, 209, 1471, 1187.5, 1391.5, 1471.0, 1471.0, 0.06847606516964945, 52.7015173791642, 0.1427412619649696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfd76707-5fa6-4744-b22c-b317fcec8051", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 6, 35.294117647058826, 806.2941176470588, 100, 1584, 1018.0, 1372.7999999999997, 1584.0, 1584.0, 0.07941772790552093, 61.4853436335012, 0.13444625697240936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 464.8823529411765, 203, 1483, 401.0, 1257.3999999999999, 1483.0, 1483.0, 0.09509053177981508, 13.513720348884366, 0.2109985047713073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84a80856-a7d8-4b82-befb-b8874564b689", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["register", 25, 11, 44.0, 923.5200000000001, 133, 1679, 917.0, 1537.0000000000002, 1658.8999999999999, 1679.0, 0.10692808444752397, 0.03301404607317303, 0.04824294435034773], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=690735fd-0c21-4760-8f6d-26c00a18c56d", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 342.8, 203, 1218, 211.0, 604.8000000000002, 1187.8499999999995, 1218.0, 0.09015425392847161, 5.525526930484308, 0.2016056895222726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ec937a-34d9-4e65-837e-fcbeb12156b4", 3, 0, 0.0, 330.3333333333333, 188, 478, 325.0, 478.0, 478.0, 478.0, 0.026787149311570262, 0.026865627288069002, 0.017177957078057752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 111.33333333333333, 104, 133, 108.0, 130.0, 133.0, 133.0, 0.10078105316200554, 0.07824310279667424, 0.03582451499118166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0dfbe6b-d16d-47cc-9bb6-f52e1889d94b", 1, 0, 0.0, 1242.0, 1242, 1242, 1242.0, 1242.0, 1242.0, 1242.0, 0.8051529790660226, 0.14546220813204508, 0.5551152375201288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 375.94444444444446, 201, 627, 406.5, 620.7, 627.0, 627.0, 0.09909602404730183, 0.1535794825811211, 0.22286928064544545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=add82b05-7453-42c9-9f3b-c198a6e7ee15", 1, 0, 0.0, 1176.0, 1176, 1176, 1176.0, 1176.0, 1176.0, 1176.0, 0.8503401360544217, 0.15362590348639457, 0.5862696641156463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 140.1818181818182, 100, 308, 104.0, 306.4, 308.0, 308.0, 0.053334109102193, 0.03963599319020398, 0.02677122273293672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 121.27272727272728, 99, 303, 103.0, 264.40000000000015, 303.0, 303.0, 0.05333436769682806, 0.01427111010637782, 0.030417256577097252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 149.0909090909091, 100, 418, 103.0, 395.20000000000005, 418.0, 418.0, 0.05333488489362115, 0.014375418193983825, 0.031355078814413996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 121.0, 100, 310, 103.0, 268.8000000000002, 310.0, 310.0, 0.05333436769682806, 0.014375278793285687, 0.03140685910272199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 108.0, 105, 113, 106.0, 113.0, 113.0, 113.0, 0.16090967603518558, 0.0474557833619395, 0.09946857903346921], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1146.472727272727, 785, 2165, 1079.0, 1588.0, 1777.5999999999997, 2165.0, 0.23994311166952417, 287.05537927916725, 0.47379391776931434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, 44.0, 923.5200000000001, 133, 1679, 917.0, 1537.0000000000002, 1658.8999999999999, 1679.0, 0.10495822662580293, 0.03240585247071665, 0.047354199903438435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.0, 100, 305, 104.0, 305.0, 305.0, 305.0, 0.05611267424989379, 0.015124119231416685, 0.033042912668638624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 158.14285714285714, 100, 304, 102.0, 304.0, 304.0, 304.0, 0.05611537320731424, 0.015124846684783916, 0.03298970182695622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 134.75, 100, 305, 101.5, 301.40000000000003, 305.0, 305.0, 0.09902133909857574, 0.02668934530391299, 0.058213716930998624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 152.24999999999997, 97, 306, 102.0, 306.0, 306.0, 306.0, 0.09902052200318516, 0.026689125071171, 0.05830993629679751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 187.85714285714286, 100, 304, 104.0, 304.0, 304.0, 304.0, 0.05611492336304752, 0.01501512597800295, 0.03200304223048804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 102.58333333333333, 97, 107, 103.0, 106.4, 107.0, 107.0, 0.09918748915136838, 0.07371257738690559, 0.04978747014043295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 162.0, 102, 308, 103.0, 308.0, 308.0, 308.0, 0.056114473525993025, 0.04170226011062567, 0.028166835344101967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 134.91666666666666, 99, 304, 102.0, 303.4, 304.0, 304.0, 0.09918912887147568, 0.02654084112381283, 0.05656880005951348], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 614.1999999999999, 100, 2626, 483.0, 1872.4000000000005, 2626.0, 2626.0, 0.09562301582242169, 0.018937839461706168, 0.0650684740479135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.99999999999997, 103, 302, 113.0, 302.0, 302.0, 302.0, 0.05617030837499298, 0.044212176318597994, 0.019966789305173285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1380.9599999999998, 1060, 2492, 1251.0, 2140.8, 2420.2999999999997, 2492.0, 0.10588912984548658, 0.05480589728330849, 0.04870486343478924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 352.1428571428571, 206, 614, 213.0, 614.0, 614.0, 614.0, 0.05606638259699485, 0.08689194255999103, 0.12609460851648352], "isController": false}, {"data": ["addBook", 55, 19, 34.54545454545455, 982.8181818181821, 508, 2569, 840.0, 1791.0, 1993.0, 2569.0, 0.26435698767615784, 70.06298962368783, 0.9616736440889778], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 177.81818181818184, 102, 543, 105.0, 411.0, 419.5999999999999, 543.0, 0.240875209123477, 0.17900979896774025, 0.11643869972277453], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 636.5636363636364, 487, 1009, 605.0, 818.1999999999999, 923.3999999999996, 1009.0, 0.2407392006583123, 70.78531828731568, 0.1210748909560848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b157b50c-1c5c-4cb7-92ce-0a4a16813967", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 142.94545454545454, 100, 419, 105.0, 303.4, 314.59999999999997, 419.0, 0.24126298981870184, 0.4269223999526247, 0.11733297747042334], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 964.8727272727275, 681, 1695, 952.0, 1184.8, 1399.1999999999998, 1695.0, 0.24043610738313712, 216.34483206494178, 0.12068765546380125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 107.05555555555554, 103, 118, 106.0, 114.4, 118.0, 118.0, 0.10158988164778787, 0.07589478462945091, 0.0361120282419871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 19, 11.515151515151516, 158.07878787878786, 100, 1050, 109.0, 305.4, 371.7, 712.0800000000017, 0.6895542971770066, 1.5312137592201769, 0.3279994632446664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 133.36363636363635, 104, 402, 107.0, 343.4000000000002, 402.0, 402.0, 0.05472854640980736, 0.04238255595993871, 0.01945428798161121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9caf71c4-0b46-4785-af00-af1206bdd927", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2315aef4-e843-449c-9ca0-83ebfc3f9efe", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 104.64705882352939, 102, 108, 104.0, 107.2, 108.0, 108.0, 0.0991450200039658, 0.08045850744462459, 0.03524295632953472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfd76707-5fa6-4744-b22c-b317fcec8051", 3, 0, 0.0, 316.0, 225, 426, 297.0, 426.0, 426.0, 426.0, 0.021433929911049192, 0.021496724627585468, 0.013745065730718393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44f7d9cc-1fd2-4665-ad63-bf8c01fe454b", 3, 0, 0.0, 328.6666666666667, 224, 425, 337.0, 425.0, 425.0, 425.0, 0.02283626398721169, 0.03148163345893278, 0.014644348976174164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf21737-bb3b-46fc-8528-9162b81326ea", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8197a16c-10fb-4c0a-ac91-23b74ac5022a", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 291.90909090909093, 203, 728, 209.0, 703.4000000000001, 728.0, 728.0, 0.0533072289448561, 0.08261579329637365, 0.11988920728515975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 273.3333333333333, 199, 414, 207.0, 412.5, 414.0, 414.0, 0.09893724904979016, 0.15333341234571973, 0.2225121919547527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d44ffc9-fa9f-468c-9b32-cc416d256ac3", 3, 0, 0.0, 362.33333333333337, 224, 636, 227.0, 636.0, 636.0, 636.0, 0.0398263570831176, 0.025604510168996508, 0.025539688624264874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/670fac44-a5d4-4ee1-a7b8-8d5ea1a73c3e", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84a80856-a7d8-4b82-befb-b8874564b689", 3, 0, 0.0, 352.3333333333333, 272, 503, 282.0, 503.0, 503.0, 503.0, 0.05497929113367299, 0.03534638671517062, 0.03525690219184107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 107.36363636363636, 103, 116, 106.0, 115.2, 116.0, 116.0, 0.052595843972038134, 0.04360729641822303, 0.01869617891193543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 107.92857142857143, 103, 123, 106.5, 118.0, 123.0, 123.0, 0.06720236552326643, 0.05217371151464532, 0.02388834086959861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/690735fd-0c21-4760-8f6d-26c00a18c56d", 3, 0, 0.0, 305.6666666666667, 185, 478, 254.0, 478.0, 478.0, 478.0, 0.0951263595142214, 0.04415696245679678, 0.06100225528744015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 148.61111111111111, 99, 308, 105.0, 306.2, 308.0, 308.0, 0.09915661787793821, 0.07368963496592869, 0.049771974208261946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 170.38888888888889, 100, 319, 103.0, 310.0, 319.0, 319.0, 0.09915443302944336, 0.026531557275456523, 0.056549012587104416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 202.66666666666666, 100, 316, 197.5, 313.3, 316.0, 316.0, 0.09915934907396186, 0.02672654330509128, 0.0582948517016846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 147.5, 99, 309, 103.0, 304.5, 309.0, 309.0, 0.09915661787793821, 0.02672580716241303, 0.05839007869179368], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 26.19047619047619, 0.843558282208589], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.142857142857143, 0.23006134969325154], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.142857142857143, 0.23006134969325154], "isController": false}, {"data": ["401/Unauthorized", 25, 59.523809523809526, 1.9171779141104295], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 42, "401/Unauthorized", 25, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
