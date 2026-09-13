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

    var data = {"OkPercent": 97.0632530120482, "KoPercent": 2.9367469879518073};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.774390243902439, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37719298245614036, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ea2d2f1-6641-4480-8e05-2ad011dbe379"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70a091fc-a08e-4020-a885-53879cb40ca7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c955440-9eb4-489a-8c2f-91dad66c9ca0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43bdde13-242d-4f6d-b6f5-c23f2e863001"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/374f74ab-b793-4157-b601-b17eba7efaf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1783fa37-51e0-4b10-a94a-7f2cff0b63ae"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbca6e35-9e5a-476b-b946-cfb96b3f339a"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.72, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/62568d02-1bc0-44b6-a6dd-8532780cc2fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b482872-a767-4d53-90c6-4d92707d9b2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daa80286-d501-43e1-ac7c-5adbb90030df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a95ce438-73d2-44ac-ae13-170d32baf3c5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1783fa37-51e0-4b10-a94a-7f2cff0b63ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c955440-9eb4-489a-8c2f-91dad66c9ca0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5861ed49-a0bf-4fcf-8bcf-f9dcd1b89cff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ce53d81-150a-446e-94eb-e5069672fbe6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da6514ac-171d-4bd9-b017-c2be623dc239"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58f521f5-016f-428d-9bfa-6eb7a414335e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37aefa54-5563-4274-b5b5-589343659fd2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ea2d2f1-6641-4480-8e05-2ad011dbe379"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b482872-a767-4d53-90c6-4d92707d9b2f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43bdde13-242d-4f6d-b6f5-c23f2e863001"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=374f74ab-b793-4157-b601-b17eba7efaf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7807017543859649, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9041916167664671, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a95ce438-73d2-44ac-ae13-170d32baf3c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58f521f5-016f-428d-9bfa-6eb7a414335e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62568d02-1bc0-44b6-a6dd-8532780cc2fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/37aefa54-5563-4274-b5b5-589343659fd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3ce53d81-150a-446e-94eb-e5069672fbe6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daa80286-d501-43e1-ac7c-5adbb90030df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da6514ac-171d-4bd9-b017-c2be623dc239"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 39, 2.9367469879518073, 330.1927710843377, 77, 2527, 98.5, 915.3000000000004, 1157.1, 1916.5700000000024, 5.219387193636121, 765.0821633436306, 3.811466986049537], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1366.3859649122803, 958, 1936, 1344.0, 1636.2, 1764.6, 1936.0, 0.25251965887695205, 303.8665688337579, 1.2416371898881382], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0ea2d2f1-6641-4480-8e05-2ad011dbe379", 3, 0, 0.0, 441.33333333333337, 182, 797, 345.0, 797.0, 797.0, 797.0, 0.0705284935113786, 0.03122355181493323, 0.04522823314369005], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 659.2941176470587, 84, 2527, 488.0, 1470.999999999999, 2527.0, 2527.0, 0.08076162967467315, 0.016761935203044236, 0.053983359541273944], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 659.2941176470587, 84, 2527, 488.0, 1470.999999999999, 2527.0, 2527.0, 0.08081269044461241, 0.016772532776676508, 0.05401749000537167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 107.38888888888889, 78, 242, 82.0, 238.4, 242.0, 242.0, 0.09544514555384698, 0.03350315167824381, 0.05398823174611591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70a091fc-a08e-4020-a885-53879cb40ca7", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 95.88888888888889, 79, 301, 82.5, 114.7000000000003, 301.0, 301.0, 0.09552061387914519, 0.07098748746291943, 0.0479468706385553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 139.94444444444446, 79, 663, 82.0, 284.1000000000006, 663.0, 663.0, 0.0954426151276545, 1.5833677158726371, 0.05574735213022615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c955440-9eb4-489a-8c2f-91dad66c9ca0", 3, 0, 0.0, 843.0, 214, 2043, 272.0, 2043.0, 2043.0, 2043.0, 0.03304183095799282, 0.02754561493600899, 0.02118893456616076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 128.16666666666666, 78, 890, 82.0, 178.10000000000113, 890.0, 890.0, 0.09551301099460882, 4.7989121548929194, 0.05569519543023305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43bdde13-242d-4f6d-b6f5-c23f2e863001", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 438.1666666666667, 79, 2483, 242.5, 1816.100000000001, 2483.0, 2483.0, 0.08313511765928458, 0.12223099438837956, 0.05372300273653096], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/374f74ab-b793-4157-b601-b17eba7efaf3", 3, 0, 0.0, 308.0, 248, 426, 250.0, 426.0, 426.0, 426.0, 0.02710639259091936, 0.02718580585046307, 0.01738268014456743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 103.5, 81, 242, 83.0, 241.3, 242.0, 242.0, 0.0900069755406044, 0.06688994959609369, 0.04517928264440494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 626.4444444444443, 478, 696, 642.0, 696.0, 696.0, 696.0, 0.04306117078538791, 12.66141397634028, 0.02455832396354154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 111.49999999999999, 78, 238, 83.0, 233.8, 238.0, 238.0, 0.09000900090009001, 0.04098310221647165, 0.050388339615211525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 781.6666666666666, 553, 1002, 719.0, 1002.0, 1002.0, 1002.0, 0.043019798667342235, 38.709290461614394, 0.024492717405332546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 152.8888888888889, 81, 241, 91.0, 241.0, 241.0, 241.0, 0.04314084527296171, 0.07633907386192053, 0.023887557880634076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 95.49999999999999, 81, 244, 83.0, 146.7000000000001, 244.0, 244.0, 0.07256926963565692, 0.05393087323509268, 0.0364263716725856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 102.0, 78, 244, 81.0, 239.8, 244.0, 244.0, 0.07257749916082266, 0.026233151246972158, 0.04101089399602638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1783fa37-51e0-4b10-a94a-7f2cff0b63ae", 1, 0, 0.0, 1335.0, 1335, 1335, 1335.0, 1335.0, 1335.0, 1335.0, 0.7490636704119851, 0.13532888576779026, 0.5164442883895132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 151.875, 78, 879, 82.0, 435.90000000000043, 879.0, 879.0, 0.07257716994397949, 4.099905770168515, 0.04227761901521852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 229.125, 80, 1252, 82.5, 810.3000000000004, 1252.0, 1252.0, 0.07252617741716151, 1.351145332827161, 0.0423187412175332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 119.0, 79, 237, 83.0, 237.0, 237.0, 237.0, 0.04317375035978126, 0.03208517971073587, 0.02424307271179123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 494.7777777777778, 79, 1045, 390.0, 1027.9, 1045.0, 1045.0, 0.08252981389526967, 37.1413579894018, 0.0449723009312114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 194.0625, 78, 1000, 82.5, 858.6000000000001, 1000.0, 1000.0, 0.0900074818719306, 10.144838651040992, 0.05194767752569432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbca6e35-9e5a-476b-b946-cfb96b3f339a", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 376.7777777777778, 77, 749, 357.5, 725.6, 749.0, 749.0, 0.0825313275164031, 12.144597679838055, 0.04505372273600521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 180.62500000000003, 78, 640, 82.0, 638.6, 640.0, 640.0, 0.0900074818719306, 3.329375875463398, 0.05203557545720988], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 415.1176470588235, 83, 1335, 413.0, 778.9999999999995, 1335.0, 1335.0, 0.0811204161000167, 0.016836400699067115, 0.05456801887242622], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 352.0625, 162, 1335, 184.0, 1082.3000000000002, 1335.0, 1335.0, 0.07249134634553, 5.525628982776509, 0.1618755125364722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 701.96, 101, 1936, 457.0, 1583.2, 1834.2999999999997, 1936.0, 0.1053971787283198, 0.06474104044932925, 0.04765516967891803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 83.44444444444443, 79, 95, 83.0, 91.4, 95.0, 95.0, 0.0825283003296547, 0.06133206694420629, 0.04142533825140871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 109.61111111111111, 77, 247, 82.0, 244.3, 247.0, 247.0, 0.08252905710552257, 0.0840603579697852, 0.04360177724032003], "isController": false}, {"data": ["login", 25, 0, 0.0, 2847.879999999999, 1696, 4475, 2727.0, 4308.6, 4444.7, 4475.0, 0.10730949345626709, 46.35999407517459, 0.2259661274901168], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62568d02-1bc0-44b6-a6dd-8532780cc2fc", 3, 0, 0.0, 730.0, 213, 1593, 384.0, 1593.0, 1593.0, 1593.0, 0.034192710114203655, 0.028505055534660012, 0.021926965795892317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b482872-a767-4d53-90c6-4d92707d9b2f", 3, 0, 0.0, 338.3333333333333, 200, 432, 383.0, 432.0, 432.0, 432.0, 0.018311217451810982, 0.02524349150664697, 0.01174254504559493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daa80286-d501-43e1-ac7c-5adbb90030df", 3, 0, 0.0, 429.3333333333333, 382, 459, 447.0, 459.0, 459.0, 459.0, 0.09179083927424043, 0.04254887862191353, 0.05886326607104611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 91.75, 81, 118, 87.0, 110.30000000000001, 118.0, 118.0, 0.08568154312459167, 0.0693652336428579, 0.030457111032569695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a95ce438-73d2-44ac-ae13-170d32baf3c5", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1783fa37-51e0-4b10-a94a-7f2cff0b63ae", 3, 0, 0.0, 423.33333333333337, 222, 797, 251.0, 797.0, 797.0, 797.0, 0.03340236488743403, 0.02751998226891131, 0.02142013633731935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c955440-9eb4-489a-8c2f-91dad66c9ca0", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5861ed49-a0bf-4fcf-8bcf-f9dcd1b89cff", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ce53d81-150a-446e-94eb-e5069672fbe6", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 580.8333333333333, 161, 1129, 481.5, 1111.0, 1129.0, 1129.0, 0.08249728446438638, 49.411643797063554, 0.17498447446938206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da6514ac-171d-4bd9-b017-c2be623dc239", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58f521f5-016f-428d-9bfa-6eb7a414335e", 3, 0, 0.0, 1078.0, 181, 2483, 570.0, 2483.0, 2483.0, 2483.0, 0.04346944098298896, 0.02794666209030052, 0.027875911047033936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37aefa54-5563-4274-b5b5-589343659fd2", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 267.6666666666667, 162, 973, 172.5, 582.4000000000007, 973.0, 973.0, 0.09540012402016122, 6.480288404843677, 0.21320105841137593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, 50.0, 492.22222222222223, 78, 1082, 358.0, 1049.6000000000001, 1082.0, 1082.0, 0.0842617732422058, 50.41446076853759, 0.12283603770714352], "isController": false}, {"data": ["register", 25, 9, 36.0, 1070.7600000000002, 112, 2291, 1070.0, 1743.6000000000004, 2151.7999999999997, 2291.0, 0.10937616212172255, 0.03407751051104918, 0.04934744814476154], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 329.5625, 163, 1242, 176.0, 991.4000000000003, 1242.0, 1242.0, 0.08996496988984914, 13.575672224580678, 0.19945602821526368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 107.99999999999999, 81, 251, 87.0, 243.8, 251.0, 251.0, 0.10960265384559177, 0.08509190410863815, 0.038960318359175204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 321.05555555555554, 162, 951, 189.5, 858.3000000000002, 951.0, 951.0, 0.09871451761505726, 13.257865284846226, 0.21920492653994647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ea2d2f1-6641-4480-8e05-2ad011dbe379", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 85.33333333333333, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.016952696326350707, 0.012598634672219618, 0.008509458898187758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 81.33333333333333, 80, 82, 82.0, 82.0, 82.0, 82.0, 0.01695327113366524, 0.00453632450256277, 0.009668662443418458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 81.33333333333333, 78, 84, 82.0, 84.0, 84.0, 84.0, 0.016952983725135623, 0.0045693588946654606, 0.009966500197784809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 83.0, 80, 87, 82.0, 87.0, 87.0, 87.0, 0.016952792124862965, 0.004569307252404471, 0.009982943018840203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 89.0, 83, 97, 88.0, 97.0, 97.0, 97.0, 0.02408390833664487, 0.007102871403971436, 0.014887806618258009], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 942.4912280701756, 623, 1591, 880.0, 1278.2, 1379.6999999999998, 1591.0, 0.2512330252423077, 300.5620409212318, 0.4960870869530723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1070.7600000000002, 112, 2291, 1070.0, 1743.6000000000004, 2151.7999999999997, 2291.0, 0.10775351168694587, 0.03357195348496408, 0.04861535390563378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 121.37499999999999, 78, 242, 82.0, 242.0, 242.0, 242.0, 0.0394685558948755, 0.010638009206040662, 0.02324173750450188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 103.375, 79, 243, 82.0, 243.0, 243.0, 243.0, 0.03946875061669923, 0.010638061689657214, 0.023203308468020444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 101.53333333333333, 78, 237, 81.0, 235.2, 237.0, 237.0, 0.10874214338014078, 0.02930940583292857, 0.06392848663559057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 123.66666666666666, 79, 245, 82.0, 242.0, 245.0, 245.0, 0.1087437200501671, 0.029309830794771605, 0.06403560858422927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 99.875, 77, 233, 80.5, 233.0, 233.0, 233.0, 0.03946991898799128, 0.010561286916708603, 0.022510188172838775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 85.79999999999998, 77, 124, 82.0, 107.20000000000002, 124.0, 124.0, 0.10874450840232568, 0.08081501063883774, 0.054584645819136135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 102.625, 80, 235, 84.5, 235.0, 235.0, 235.0, 0.0394685558948755, 0.029331612339844, 0.019811364970669928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 81.00000000000001, 78, 86, 81.0, 84.2, 86.0, 86.0, 0.10874529676591488, 0.029097862611192064, 0.06201880206181082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.75, 84, 235, 85.0, 235.0, 235.0, 235.0, 0.03833694339550307, 0.030175367555444806, 0.013627585347620236], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 720.125, 78, 2043, 630.0, 1793.8000000000002, 2043.0, 2043.0, 0.07707463232991796, 0.015599333545288571, 0.052443115308467125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1639.4000000000003, 892, 2284, 1504.0, 2240.4, 2272.9, 2284.0, 0.10884898726902245, 0.056337854738849516, 0.05006628223018513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 246.875, 163, 479, 175.0, 479.0, 479.0, 479.0, 0.039450844248066906, 0.06114110334148651, 0.08872587334306455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b482872-a767-4d53-90c6-4d92707d9b2f", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43bdde13-242d-4f6d-b6f5-c23f2e863001", 3, 0, 0.0, 467.0, 278, 747, 376.0, 747.0, 747.0, 747.0, 0.03179582838731558, 0.026506873860649482, 0.02038990296973037], "isController": false}, {"data": ["addBook", 55, 13, 23.636363636363637, 933.5090909090908, 408, 3083, 754.0, 1558.8, 1693.3999999999985, 3083.0, 0.2586433918964674, 85.46795570026522, 0.9375409641167564], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=374f74ab-b793-4157-b601-b17eba7efaf3", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 150.1052631578948, 79, 448, 84.0, 330.4, 340.99999999999994, 448.0, 0.252080771986308, 0.18733737058748087, 0.12185545130197507], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 533.4912280701756, 386, 794, 482.0, 696.0, 715.6999999999999, 794.0, 0.251794588625069, 74.03596942297074, 0.126634973771397], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 119.47368421052632, 79, 253, 86.0, 242.0, 244.79999999999995, 253.0, 0.25241789775746626, 0.44666135814114144, 0.12275792293283026], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 790.8245614035088, 539, 1256, 770.0, 965.6, 1047.4999999999998, 1256.0, 0.25166007346708114, 226.44417647690244, 0.12632156031453093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 99.5, 83, 248, 90.0, 131.90000000000018, 248.0, 248.0, 0.09848551168694739, 0.07357560199269018, 0.03500852173246958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, 7.7844311377245505, 158.8383233532934, 80, 1804, 89.0, 307.6, 398.3999999999999, 1256.5999999999945, 0.6764036388085575, 1.5755551661340494, 0.3208534710240022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 89.0, 84, 92, 91.0, 92.0, 92.0, 92.0, 0.01689950428120775, 0.013087213764646236, 0.006007245662460568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 103.44444444444444, 81, 292, 85.0, 152.50000000000023, 292.0, 292.0, 0.09973127960772364, 0.08093427085353352, 0.03545135329805801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a95ce438-73d2-44ac-ae13-170d32baf3c5", 3, 0, 0.0, 398.66666666666663, 212, 690, 294.0, 690.0, 690.0, 690.0, 0.04723665564478035, 0.030368618131002993, 0.03029173555345615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 170.0, 169, 171, 170.0, 171.0, 171.0, 171.0, 0.016944365998305566, 0.02626045785088958, 0.038108276263767296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58f521f5-016f-428d-9bfa-6eb7a414335e", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 211.06666666666663, 160, 370, 165.0, 349.0, 370.0, 370.0, 0.10867911404786228, 0.16843140038472407, 0.2444218746603778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62568d02-1bc0-44b6-a6dd-8532780cc2fc", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 88.93749999999999, 81, 110, 85.0, 110.0, 110.0, 110.0, 0.07259824584488478, 0.0601913190647531, 0.025806407702673884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37aefa54-5563-4274-b5b5-589343659fd2", 3, 0, 0.0, 993.6666666666666, 219, 1742, 1020.0, 1742.0, 1742.0, 1742.0, 0.0232181968748307, 0.027443122673343187, 0.014889273386528802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 116.72222222222223, 84, 249, 87.5, 246.3, 249.0, 249.0, 0.08225826352805692, 0.06386261670391138, 0.02924024211348898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ce53d81-150a-446e-94eb-e5069672fbe6", 3, 0, 0.0, 818.3333333333333, 333, 1687, 435.0, 1687.0, 1687.0, 1687.0, 0.10074890015783994, 0.04558625365214763, 0.0646078558954898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daa80286-d501-43e1-ac7c-5adbb90030df", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da6514ac-171d-4bd9-b017-c2be623dc239", 2, 0, 0.0, 241.5, 235, 248, 241.5, 248.0, 248.0, 248.0, 0.022977941176470586, 0.03271663890165441, 0.014282675350413603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 107.27777777777779, 80, 323, 83.0, 247.40000000000012, 323.0, 323.0, 0.0988446162632342, 0.0734577665784387, 0.04961536402275622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 138.38888888888889, 79, 325, 81.0, 252.1000000000001, 325.0, 325.0, 0.0987616387847929, 0.04290815990606671, 0.05540339328530591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 188.55555555555554, 78, 765, 82.0, 716.4000000000001, 765.0, 765.0, 0.0987616387847929, 9.897650107403281, 0.057118005069764125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 178.38888888888889, 78, 641, 81.5, 634.7, 641.0, 641.0, 0.0988478731232633, 3.2530774981054154, 0.057264409136838404], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.076923076923077, 0.677710843373494], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.820512820512821, 0.37650602409638556], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.30120481927710846], "isController": false}, {"data": ["401/Unauthorized", 21, 53.84615384615385, 1.5813253012048192], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 39, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
