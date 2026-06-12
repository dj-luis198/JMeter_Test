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

    var data = {"OkPercent": 97.56480754124117, "KoPercent": 2.4351924587588374};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7368775235531628, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fee51fba-c868-4a7c-b57c-fcc09498ebf5"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a9e5bea-7c20-40a0-af89-b339f23c6f0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6653c4e2-885f-403a-872d-1c2c0e0fc3ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d514ab9-a3ea-4b94-8811-0dd93bf8a980"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50e88558-abcc-4d84-8d88-335c45b1f2b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6653c4e2-885f-403a-872d-1c2c0e0fc3ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa42165b-fcca-4266-b53b-1c43029d417c"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8108d418-0550-47af-8c53-3e8fb268ecc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a9e5bea-7c20-40a0-af89-b339f23c6f0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b53690c-f462-4be0-ab6c-4275ed698ba4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e5d2ad8-c441-4b92-8b71-1b68b591fd5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7dd2c4f-ac49-4e06-8521-6b1f431d8c92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a929ce4d-4ab1-4b74-9b43-239bf2fe40c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc43920c-13b6-4bef-a4cc-4ae848259ac5"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc49bce4-4fa1-4c00-a8f4-d53dab723a57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddd0802c-c441-4c2a-9c23-32a96c2febf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fee51fba-c868-4a7c-b57c-fcc09498ebf5"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.27450980392156865, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc43920c-13b6-4bef-a4cc-4ae848259ac5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3de2635b-b3e0-47ae-9aca-43399125e622"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50e88558-abcc-4d84-8d88-335c45b1f2b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d514ab9-a3ea-4b94-8811-0dd93bf8a980"], "isController": false}, {"data": [0.23770491803278687, 500, 1500, "addBook"], "isController": true}, {"data": [0.9019607843137255, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8108d418-0550-47af-8c53-3e8fb268ecc7"], "isController": false}, {"data": [0.9803921568627451, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8930635838150289, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ddd0802c-c441-4c2a-9c23-32a96c2febf6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc49bce4-4fa1-4c00-a8f4-d53dab723a57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3de2635b-b3e0-47ae-9aca-43399125e622"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa42165b-fcca-4266-b53b-1c43029d417c"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7dd2c4f-ac49-4e06-8521-6b1f431d8c92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b53690c-f462-4be0-ab6c-4275ed698ba4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 31, 2.4351924587588374, 441.7698350353495, 1, 2276, 149.0, 1223.4000000000005, 1529.6, 1834.0199999999998, 4.9133505731599065, 670.3679223435872, 3.5841264739086807], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 2198.6470588235284, 1705, 2834, 2132.0, 2657.4, 2736.0, 2834.0, 0.22636685634137899, 272.39593244974435, 1.1130440641394952], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fee51fba-c868-4a7c-b57c-fcc09498ebf5", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 0.24884857093663912, 0.9496599517906337], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 591.5, 133, 1099, 585.5, 967.0, 1099.0, 1099.0, 0.07434352016567984, 0.014037940087088124, 0.05027625753391923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 591.5, 133, 1099, 585.5, 967.0, 1099.0, 1099.0, 0.07354833964623249, 0.01388778985926, 0.049738501176773434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 232.76923076923077, 127, 396, 137.0, 395.6, 396.0, 396.0, 0.17969700320690035, 0.06884425453389363, 0.10132254402576579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 173.53846153846152, 129, 394, 133.0, 392.0, 394.0, 394.0, 0.18030763256078447, 0.13399815271362986, 0.09050597962523751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 204.53846153846155, 130, 1057, 133.0, 692.1999999999997, 1057.0, 1057.0, 0.17806755609128017, 4.071823933991727, 0.10368101166342493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 315.6153846153846, 130, 1195, 136.0, 876.9999999999998, 1195.0, 1195.0, 0.17773159794378213, 12.346004221979928, 0.10331183179755003], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 231.93333333333334, 131, 404, 224.0, 354.20000000000005, 404.0, 404.0, 0.07837768639520121, 0.13671191236329625, 0.05065974417523161], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a9e5bea-7c20-40a0-af89-b339f23c6f0b", 3, 0, 0.0, 386.3333333333333, 242, 469, 448.0, 469.0, 469.0, 469.0, 0.04977765978628792, 0.032002238957655804, 0.031921220631180726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 150.23529411764707, 131, 388, 135.0, 191.19999999999982, 388.0, 388.0, 0.14017150395778366, 0.10417042432800132, 0.07035952444755937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 179.58823529411762, 128, 399, 134.0, 395.8, 399.0, 399.0, 0.13987625065824116, 0.049785917341363874, 0.07908214952771195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 880.7142857142858, 751, 1058, 782.0, 1058.0, 1058.0, 1058.0, 0.0477910303063405, 14.052149721617248, 0.02725582197158482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 1, 14.285714285714286, 1208.2857142857144, 1, 1677, 1449.0, 1677.0, 1677.0, 1677.0, 0.04749111237754078, 36.64069840981099, 0.02317576884718717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 248.0, 131, 406, 134.0, 406.0, 406.0, 406.0, 0.047905502973563004, 0.08477028455868765, 0.02652580096290061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6653c4e2-885f-403a-872d-1c2c0e0fc3ec", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 0.18102611472945893, 0.6908347945891784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d514ab9-a3ea-4b94-8811-0dd93bf8a980", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 166.87499999999997, 129, 409, 135.0, 388.0, 409.0, 409.0, 0.08381088074759306, 0.062285234618084294, 0.04206913350025667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 165.37500000000003, 126, 401, 133.0, 393.3, 401.0, 401.0, 0.08381834469246525, 0.022427955513413554, 0.04780264970742159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 149.6875, 126, 393, 133.0, 217.30000000000018, 393.0, 393.0, 0.08381790560008381, 0.022591544868772594, 0.04927576090942428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 164.74999999999997, 127, 383, 134.0, 380.2, 383.0, 383.0, 0.08381614927656186, 0.022591071484698313, 0.04935658009156914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50e88558-abcc-4d84-8d88-335c45b1f2b3", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 169.85714285714286, 128, 399, 132.0, 399.0, 399.0, 399.0, 0.04790648653827728, 0.03560237915588771, 0.026900614999520935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 890.7222222222224, 127, 1734, 1306.5, 1599.9000000000003, 1734.0, 1734.0, 0.0887110287522301, 44.35637106899254, 0.04791704656343331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 252.23529411764704, 130, 1399, 133.0, 592.5999999999992, 1399.0, 1399.0, 0.13988545849516162, 7.439555146242018, 0.08153020805904812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 674.7777777777778, 127, 1084, 794.5, 1074.1, 1084.0, 1084.0, 0.08871321481904969, 14.502088610948196, 0.048004861360959286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 234.35294117647058, 127, 755, 133.0, 527.7999999999998, 755.0, 755.0, 0.1401772830344259, 2.460075886415172, 0.08183718563182849], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 503.92857142857144, 133, 998, 471.0, 901.0, 998.0, 998.0, 0.0737063224230427, 0.013917621009987205, 0.05044173613926283], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 351.5, 261, 799, 270.5, 786.4, 799.0, 799.0, 0.08375297061317644, 0.12980074644835057, 0.18836239386928255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6653c4e2-885f-403a-872d-1c2c0e0fc3ec", 3, 0, 0.0, 390.6666666666667, 231, 615, 326.0, 615.0, 615.0, 615.0, 0.049620403910087825, 0.03190113858151805, 0.03182037620536231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa42165b-fcca-4266-b53b-1c43029d417c", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 633.9545454545454, 229, 1247, 658.5, 1068.8, 1221.7999999999997, 1247.0, 0.0941393947692729, 0.05782585870104751, 0.042564980252122415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 164.72222222222223, 129, 398, 135.5, 395.3, 398.0, 398.0, 0.0887027226807934, 0.06592067574226931, 0.04452460884563262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 251.50000000000003, 130, 429, 135.0, 409.20000000000005, 429.0, 429.0, 0.08871190316602925, 0.0977602092615227, 0.04645438852856523], "isController": false}, {"data": ["login", 22, 1, 4.545454545454546, 2813.5, 1734, 4165, 2825.5, 3800.1, 4115.799999999999, 4165.0, 0.08996630352995061, 30.695701661769636, 0.18087907429785388], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8108d418-0550-47af-8c53-3e8fb268ecc7", 3, 0, 0.0, 796.0, 222, 1655, 511.0, 1655.0, 1655.0, 1655.0, 0.02475513050079629, 0.024827655297185343, 0.015874872098492414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 166.1764705882353, 133, 395, 137.0, 387.0, 395.0, 395.0, 0.1314151869574292, 0.1063898339723719, 0.04671399223877367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a9e5bea-7c20-40a0-af89-b339f23c6f0b", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b53690c-f462-4be0-ab6c-4275ed698ba4", 3, 0, 0.0, 483.33333333333337, 217, 869, 364.0, 869.0, 869.0, 869.0, 0.031281281281281284, 0.026077917109818154, 0.020059936238321655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e5d2ad8-c441-4b92-8b71-1b68b591fd5b", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7dd2c4f-ac49-4e06-8521-6b1f431d8c92", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a929ce4d-4ab1-4b74-9b43-239bf2fe40c8", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc43920c-13b6-4bef-a4cc-4ae848259ac5", 3, 0, 0.0, 347.6666666666667, 223, 570, 250.0, 570.0, 570.0, 570.0, 0.1271887056429389, 0.05754957709755374, 0.0815630696994107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1114.7222222222222, 264, 1872, 1448.5, 1736.1000000000001, 1872.0, 1872.0, 0.08864506025401735, 58.97789783164333, 0.18676444606686793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc49bce4-4fa1-4c00-a8f4-d53dab723a57", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddd0802c-c441-4c2a-9c23-32a96c2febf6", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fee51fba-c868-4a7c-b57c-fcc09498ebf5", 3, 0, 0.0, 333.3333333333333, 217, 455, 328.0, 455.0, 455.0, 455.0, 0.0185320171482932, 0.02554788171322321, 0.011884138600956252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 492.07692307692304, 264, 1331, 284.0, 1115.7999999999997, 1331.0, 1331.0, 0.17736544102599086, 16.576100859540215, 0.3954082176478614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1201.7777777777778, 131, 1921, 1578.0, 1921.0, 1921.0, 1921.0, 0.06036419732385392, 50.14956120678091, 0.1107069947013649], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1022.6956521739132, 188, 1803, 1114.0, 1704.6000000000001, 1792.1999999999998, 1803.0, 0.09455953756274849, 0.029501676376149616, 0.042662603861318156], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 470.29411764705884, 267, 1788, 273.0, 843.9999999999991, 1788.0, 1788.0, 0.13971760606210035, 10.036199444827982, 0.3121253436436708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 137.5, 130, 147, 136.5, 146.4, 147.0, 147.0, 0.0995239438021464, 0.07726712433858046, 0.03537765189841923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 482.99999999999994, 263, 1581, 395.0, 1068.6000000000006, 1581.0, 1581.0, 0.09138783856338317, 6.96600787399045, 0.20407198862792583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 152.9333333333333, 129, 403, 134.0, 257.80000000000007, 403.0, 403.0, 0.08563598995204384, 0.06364159018897009, 0.04298525276889701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 166.46666666666667, 127, 400, 131.0, 392.8, 400.0, 400.0, 0.08563501216017173, 0.03148870759639648, 0.04835925100763864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 269.4666666666667, 129, 1396, 133.0, 797.8000000000004, 1396.0, 1396.0, 0.08563452327260894, 5.158482072769363, 0.04985311895206179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 254.20000000000002, 128, 787, 134.0, 631.6000000000001, 787.0, 787.0, 0.08550857651022398, 1.697668127675706, 0.04986330207044767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.217457706766917, 4.647850093984962], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1512.1568627450981, 1050, 2276, 1431.0, 2106.8, 2178.8, 2276.0, 0.23608487945783801, 282.4395922154483, 0.46617541627319187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1022.6956521739132, 188, 1803, 1114.0, 1704.6000000000001, 1792.1999999999998, 1803.0, 0.09086814636882985, 0.028349997431987167, 0.04099715197499941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 138.6, 134, 148, 136.0, 148.0, 148.0, 148.0, 0.027434992784596896, 0.007394587898973383, 0.01615556704014837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc43920c-13b6-4bef-a4cc-4ae848259ac5", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 137.4, 133, 149, 135.0, 149.0, 149.0, 149.0, 0.027435745484076294, 0.007394790775004939, 0.01612921755997454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 284.9166666666667, 128, 1186, 133.0, 950.5000000000008, 1186.0, 1186.0, 0.1081275905568571, 8.134498121846278, 0.06279284555775816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 307.0, 131, 1047, 133.5, 891.3000000000006, 1047.0, 1047.0, 0.1081275905568571, 2.6761402673905206, 0.06289843890791133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 136.2, 128, 147, 136.0, 147.0, 147.0, 147.0, 0.027434842249657063, 0.007340963648834019, 0.015646433470507544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 156.33333333333334, 131, 392, 134.0, 318.5000000000002, 392.0, 392.0, 0.10812856486362284, 0.08035726353634472, 0.05427547103506069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 133.6, 127, 138, 134.0, 138.0, 138.0, 138.0, 0.027434992784596896, 0.020388700692459218, 0.013771080362580864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 221.58333333333337, 126, 413, 132.5, 409.7, 413.0, 413.0, 0.10813343666083948, 0.04246842165732514, 0.06091305733775479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 143.8, 137, 157, 140.0, 157.0, 157.0, 157.0, 0.02828086290568898, 0.022260132326157537, 0.010052962986006629], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 609.4615384615385, 408, 1362, 564.0, 1164.7999999999997, 1362.0, 1362.0, 0.07723842908918067, 0.013954208380369556, 0.052573422924959895], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1420.8181818181815, 1027, 2075, 1436.0, 1792.1999999999998, 2037.7999999999995, 2075.0, 0.09233339069195481, 0.04778974322923443, 0.042469752945225314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 273.8, 267, 284, 275.0, 284.0, 284.0, 284.0, 0.027413933954350315, 0.04248624334526753, 0.06165457997741092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3de2635b-b3e0-47ae-9aca-43399125e622", 3, 0, 0.0, 298.6666666666667, 220, 456, 220.0, 456.0, 456.0, 456.0, 0.01843703139211878, 0.021791946935150814, 0.011823226511222007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50e88558-abcc-4d84-8d88-335c45b1f2b3", 3, 0, 0.0, 351.0, 225, 596, 232.0, 596.0, 596.0, 596.0, 0.0284346713425904, 0.023704815530069666, 0.018234473484668973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d514ab9-a3ea-4b94-8811-0dd93bf8a980", 3, 0, 0.0, 392.0, 364, 408, 404.0, 408.0, 408.0, 408.0, 0.08988225424693651, 0.04061086227042574, 0.05763933621955238], "isController": false}, {"data": ["addBook", 61, 17, 27.868852459016395, 1254.1639344262294, 673, 2684, 1041.0, 2252.8, 2381.6, 2684.0, 0.2805642561137711, 83.62836957384128, 1.0195562413473522], "isController": true}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 244.99999999999994, 128, 582, 136.0, 537.4, 543.4, 582.0, 0.2372401987235547, 0.17630838987170422, 0.11468154137515583], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 867.9607843137256, 625, 1330, 793.0, 1152.6000000000004, 1196.2, 1330.0, 0.23699435395803806, 69.68420901682195, 0.11919149637538047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8108d418-0550-47af-8c53-3e8fb268ecc7", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 198.41176470588238, 127, 545, 135.0, 401.0, 487.9999999999999, 545.0, 0.2377012887138496, 0.4206198585444292, 0.11560082205029013], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1255.9607843137258, 906, 1717, 1213.0, 1580.0, 1659.2, 1717.0, 0.2367094600239494, 212.99158822039738, 0.11881705317608399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 153.25000000000003, 131, 403, 135.0, 230.80000000000018, 403.0, 403.0, 0.0911535481518618, 0.0680981097032952, 0.03240223781960713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, 9.826589595375722, 186.34104046242769, 129, 556, 139.0, 317.0, 383.1999999999994, 530.8399999999997, 0.7393415159492632, 1.5171667527629151, 0.35841903783035317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 156.60000000000002, 133, 381, 137.0, 250.20000000000007, 381.0, 381.0, 0.0869298128690895, 0.06731966953631638, 0.030900831918309158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 161.0, 134, 400, 140.0, 301.19999999999993, 400.0, 400.0, 0.16798252981689904, 0.13632176003695617, 0.05971253989585083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddd0802c-c441-4c2a-9c23-32a96c2febf6", 3, 0, 0.0, 426.3333333333333, 245, 551, 483.0, 551.0, 551.0, 551.0, 0.07650328964145459, 0.03461574628959045, 0.0490597267557505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc49bce4-4fa1-4c00-a8f4-d53dab723a57", 3, 0, 0.0, 665.0, 224, 1362, 409.0, 1362.0, 1362.0, 1362.0, 0.023618141882051, 0.02368733565709607, 0.015145748537643382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3de2635b-b3e0-47ae-9aca-43399125e622", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 467.8666666666667, 264, 1529, 269.0, 1094.0000000000002, 1529.0, 1529.0, 0.08544525522497737, 6.9384106150064655, 0.1907109169842382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa42165b-fcca-4266-b53b-1c43029d417c", 3, 0, 0.0, 350.3333333333333, 226, 586, 239.0, 586.0, 586.0, 586.0, 0.021183448665442733, 0.02541048448312385, 0.013584438109024148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 520.7500000000001, 266, 1321, 523.0, 1201.0000000000005, 1321.0, 1321.0, 0.10799913600691194, 10.920472206534848, 0.24058987215602276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7dd2c4f-ac49-4e06-8521-6b1f431d8c92", 3, 0, 0.0, 384.6666666666667, 269, 564, 321.0, 564.0, 564.0, 564.0, 0.04765535646206634, 0.03020344369519634, 0.030560238356207907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 137.5625, 133, 145, 136.5, 145.0, 145.0, 145.0, 0.08287536063731153, 0.06871209099714598, 0.02945960085154433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 141.33333333333337, 134, 161, 139.5, 150.20000000000002, 161.0, 161.0, 0.0852224305437191, 0.06616389871314131, 0.030293910857337653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b53690c-f462-4be0-ab6c-4275ed698ba4", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 153.0, 132, 448, 133.0, 230.30000000000024, 448.0, 448.0, 0.09159763449108926, 0.06807207016378802, 0.045977718875410044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 214.06250000000003, 128, 402, 133.5, 399.9, 402.0, 402.0, 0.09145940631412877, 0.033058020275407135, 0.05168037009620386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 246.0625, 128, 1447, 132.0, 714.1000000000008, 1447.0, 1447.0, 0.091458360723207, 5.166509814982594, 0.05327628141737594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 270.93750000000006, 128, 1051, 133.0, 593.2000000000005, 1051.0, 1051.0, 0.091598683268928, 1.706461553599542, 0.05344747388006297], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.6284367635506677], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.225806451612903, 0.07855459544383346], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.15710919088766692], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.492537313432836], "isController": false}, {"data": ["Assertion failed", 1, 3.225806451612903, 0.07855459544383346], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 31, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
