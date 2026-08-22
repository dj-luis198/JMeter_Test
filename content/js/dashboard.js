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

    var data = {"OkPercent": 97.13866471019809, "KoPercent": 2.8613352898019078};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7921383647798742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4344262295081967, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfdc6e50-775c-457d-ab0a-e86400706e83"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e51fda6-0e26-47b7-a38a-6ba1919cdeda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/68186870-fd94-49a6-87a1-1783d5a9b1a9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ed756b6-c075-473c-8c32-b2ff48b9d86d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1f08bbd-8484-4914-a98f-9d09e0c1c4a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b875672-ea75-4024-9fcd-4c8f578524f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a0a47ed-a042-4e0a-8c87-23b86c265c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b82dd66-dd49-472f-bcce-373909010ffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abe55672-aa88-4181-9033-7f8ca61cf48b"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89833b90-4d86-40e6-8d06-65585f5af806"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf434665-1985-4c30-bad8-da530747ec67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/508e9730-b4e9-4380-9d14-a0e3031f8569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1f08bbd-8484-4914-a98f-9d09e0c1c4a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a8edfd0-b337-4488-b4a9-dc8d95dfed66"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfdc6e50-775c-457d-ab0a-e86400706e83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68186870-fd94-49a6-87a1-1783d5a9b1a9"], "isController": false}, {"data": [0.7950819672131147, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cc091dd-7db1-4865-845d-88ceed661d4e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e51fda6-0e26-47b7-a38a-6ba1919cdeda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abe55672-aa88-4181-9033-7f8ca61cf48b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0a8edfd0-b337-4488-b4a9-dc8d95dfed66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b875672-ea75-4024-9fcd-4c8f578524f0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9b82dd66-dd49-472f-bcce-373909010ffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7a0a47ed-a042-4e0a-8c87-23b86c265c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89833b90-4d86-40e6-8d06-65585f5af806"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=508e9730-b4e9-4380-9d14-a0e3031f8569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ed756b6-c075-473c-8c32-b2ff48b9d86d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa9feec9-cc5c-45f8-873e-e07b0adcb3fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 39, 2.8613352898019078, 302.78136463683006, 77, 3249, 91.0, 817.8000000000018, 1011.8, 1620.839999999998, 5.379803043160782, 777.9192571626276, 3.9368163619229937], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1269.6229508196723, 949, 1809, 1265.0, 1613.8, 1680.2, 1809.0, 0.24807941794874924, 298.52328804231786, 1.2198045599335472], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dfdc6e50-775c-457d-ab0a-e86400706e83", 3, 0, 0.0, 377.66666666666663, 179, 721, 233.0, 721.0, 721.0, 721.0, 0.033814247069431924, 0.02785932920987376, 0.021684266512623986], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 532.4375, 82, 1474, 480.5, 1113.5000000000005, 1474.0, 1474.0, 0.08269203934073771, 0.017301532645266654, 0.05521550966721622], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 532.4375, 82, 1474, 480.5, 1113.5000000000005, 1474.0, 1474.0, 0.08455318924060666, 0.017690938276171856, 0.056458245257094544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 107.94117647058822, 79, 236, 80.0, 235.2, 236.0, 236.0, 0.113281223970307, 0.040319994469210835, 0.06404605964589623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 92.70588235294117, 79, 233, 81.0, 143.39999999999992, 233.0, 233.0, 0.11328273371227518, 0.08418765659672013, 0.05686262219541938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 145.1764705882353, 78, 547, 82.0, 299.7999999999998, 547.0, 547.0, 0.1132789594328056, 1.9880171059558078, 0.06613362044551949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 148.64705882352942, 78, 920, 81.0, 376.7999999999995, 920.0, 920.0, 0.1132789594328056, 6.024536607844901, 0.06602299646169839], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 216.9375, 78, 611, 200.5, 500.4000000000001, 611.0, 611.0, 0.08329689094354553, 0.13718261769590387, 0.05382980232606568], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e51fda6-0e26-47b7-a38a-6ba1919cdeda", 3, 0, 0.0, 441.3333333333333, 198, 673, 453.0, 673.0, 673.0, 673.0, 0.025380495934890567, 0.025454852856574818, 0.01627590396866355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 91.68750000000001, 79, 244, 81.0, 132.0000000000001, 244.0, 244.0, 0.11414547841223639, 0.08482881745284365, 0.057295679593642096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 602.3333333333334, 468, 632, 629.0, 632.0, 632.0, 632.0, 0.035545023696682464, 10.451417172689572, 0.020271771327014215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 109.18749999999999, 78, 238, 80.0, 236.6, 238.0, 238.0, 0.11414710708425484, 0.051973719412142405, 0.06390120032817294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 832.6666666666667, 777, 864, 846.0, 864.0, 864.0, 864.0, 0.03550695048555755, 31.949216461466083, 0.020215382942460988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 132.5, 79, 242, 80.5, 242.0, 242.0, 242.0, 0.03566079452250196, 0.06310289030739605, 0.019745771967049425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 80.75, 79, 84, 80.5, 83.3, 84.0, 84.0, 0.08971275098543849, 0.06667129248038935, 0.045031595709487685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 114.87499999999999, 78, 319, 80.0, 262.30000000000007, 319.0, 319.0, 0.08963384574015149, 0.04081228571908753, 0.05017832233451351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 202.18749999999997, 78, 937, 83.5, 766.2000000000002, 937.0, 937.0, 0.08940595331891663, 10.07703973046899, 0.05160050626121067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 159.81249999999997, 77, 630, 81.0, 630.0, 630.0, 630.0, 0.08943743851176102, 3.308289977137555, 0.05170601913961185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.035661006472472674, 0.026501978442921587, 0.020024490939132604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 636.5384615384614, 79, 1165, 772.0, 1103.8, 1165.0, 1165.0, 0.06778423755768177, 42.23111267988894, 0.035816881534009436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 203.75000000000003, 79, 935, 82.0, 884.6, 935.0, 935.0, 0.11402183518143724, 12.851521857451326, 0.06580752401584902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 435.4615384615385, 80, 632, 616.0, 632.0, 632.0, 632.0, 0.06778459099820631, 13.803951075819672, 0.03588326418001502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 179.50000000000003, 78, 633, 82.0, 628.1, 633.0, 633.0, 0.11402021008223708, 4.217606457463336, 0.0659179339537933], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 391.75, 81, 915, 471.0, 768.0000000000001, 915.0, 915.0, 0.08445009790933226, 0.017669368629955506, 0.056719291833147716], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/68186870-fd94-49a6-87a1-1783d5a9b1a9", 3, 0, 0.0, 785.6666666666666, 205, 1314, 838.0, 1314.0, 1314.0, 1314.0, 0.021239238785681923, 0.02130146311806185, 0.013620214976495243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 299.25, 160, 1017, 168.0, 846.2000000000002, 1017.0, 1017.0, 0.08936500578079881, 13.485137918828649, 0.1981258831775962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 674.3333333333335, 85, 1499, 633.0, 1048.4, 1455.4999999999993, 1499.0, 0.10368936640859534, 0.06369200338965476, 0.04688298500701138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 82.15384615384616, 79, 94, 81.0, 91.2, 94.0, 94.0, 0.06778423755768177, 0.05037480935683187, 0.03402450986782074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 148.23076923076923, 78, 324, 81.0, 296.4, 324.0, 324.0, 0.06778423755768177, 0.08862055817712543, 0.03471701710248455], "isController": false}, {"data": ["login", 21, 0, 0.0, 3090.3809523809527, 1483, 4975, 3076.0, 4714.200000000001, 4962.2, 4975.0, 0.10414806879723858, 35.74086240180325, 0.2064799394081414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ed756b6-c075-473c-8c32-b2ff48b9d86d", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.4375, 81, 238, 85.0, 144.9000000000001, 238.0, 238.0, 0.11205344949540931, 0.0907151461247015, 0.03983149962532128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1f08bbd-8484-4914-a98f-9d09e0c1c4a8", 3, 0, 0.0, 468.33333333333337, 214, 967, 224.0, 967.0, 967.0, 967.0, 0.0895843287147635, 0.041526069039656, 0.05744828371356904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b875672-ea75-4024-9fcd-4c8f578524f0", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a0a47ed-a042-4e0a-8c87-23b86c265c66", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b82dd66-dd49-472f-bcce-373909010ffa", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abe55672-aa88-4181-9033-7f8ca61cf48b", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 719.7692307692307, 162, 1246, 853.0, 1185.2, 1246.0, 1246.0, 0.06775526797208484, 56.14997954312102, 0.14038146378741526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 436.7142857142857, 78, 945, 80.5, 939.5, 945.0, 945.0, 0.07104507302418578, 36.437122890215065, 0.09555601967441059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 288.70588235294116, 161, 1154, 202.0, 489.99999999999943, 1154.0, 1154.0, 0.11321709711363, 8.132614057900556, 0.25292392518680823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89833b90-4d86-40e6-8d06-65585f5af806", 3, 0, 0.0, 951.3333333333333, 224, 2223, 407.0, 2223.0, 2223.0, 2223.0, 0.037005057357838905, 0.030849593715307762, 0.023730456704082893], "isController": false}, {"data": ["register", 24, 9, 37.5, 1019.0833333333333, 86, 1598, 1040.0, 1580.5, 1595.75, 1598.0, 0.09906630012135623, 0.030813102137355424, 0.04469592837506501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 97.94117647058822, 80, 248, 87.0, 135.9999999999999, 248.0, 248.0, 0.08273713924173845, 0.06423440009490436, 0.029410467464836717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 325.56249999999994, 161, 1016, 171.5, 964.2, 1016.0, 1016.0, 0.1139528092928516, 17.195426063322152, 0.25263805204794565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf434665-1985-4c30-bad8-da530747ec67", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 211.78947368421052, 159, 320, 164.0, 319.0, 320.0, 320.0, 0.09466630128795994, 0.1467142774843676, 0.21290673033805832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 93.38461538461537, 78, 237, 81.0, 179.39999999999995, 237.0, 237.0, 0.055723440279474484, 0.041411658254570397, 0.027970554984033093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/508e9730-b4e9-4380-9d14-a0e3031f8569", 3, 0, 0.0, 270.0, 170, 434, 206.0, 434.0, 434.0, 434.0, 0.03206361421059382, 0.02606212392052499, 0.020561627602496687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 92.0, 77, 240, 80.0, 177.19999999999993, 240.0, 240.0, 0.055724395711793426, 0.014910629321319726, 0.03178031942938219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 79.99999999999999, 78, 84, 80.0, 82.8, 84.0, 84.0, 0.055723917991538544, 0.01501933727115687, 0.032759568975494334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 92.6923076923077, 78, 239, 81.0, 176.59999999999994, 239.0, 239.0, 0.055723917991538544, 0.01501933727115687, 0.03281398686415794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 82.75, 81, 84, 83.0, 84.0, 84.0, 84.0, 0.032389975302643835, 0.009552512247459411, 0.020022318717356977], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 884.5409836065572, 621, 1456, 823.0, 1259.4, 1336.6, 1456.0, 0.2526371591986846, 302.2418732890045, 0.49885970302709015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1019.0833333333333, 86, 1598, 1040.0, 1580.5, 1595.75, 1598.0, 0.09701869631126832, 0.030176225366346638, 0.043772107124810514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.71428571428571, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.039287658623921695, 0.010589251738478894, 0.023135213037328888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 80.0, 77, 83, 80.0, 83.0, 83.0, 83.0, 0.039288320143683, 0.010589430038727058, 0.02309723508446989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 163.35294117647058, 78, 856, 81.0, 366.3999999999996, 856.0, 856.0, 0.08380039731247196, 4.456772589444601, 0.04884184461927508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 140.0, 78, 625, 80.0, 318.59999999999974, 625.0, 625.0, 0.08380122349786308, 1.4706902910120723, 0.0489241632817545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 91.05882352941175, 79, 240, 81.0, 123.9999999999999, 240.0, 240.0, 0.08386612992343516, 0.062326293820052885, 0.042096865996724284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 80.28571428571429, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.039287658623921695, 0.010512518030229047, 0.02240624280895534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 80.11764705882352, 77, 83, 80.0, 81.4, 83.0, 83.0, 0.08386654366240262, 0.029850477052633655, 0.04741581587347005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.85714285714286, 79, 87, 81.0, 87.0, 87.0, 87.0, 0.039285894680128636, 0.02919586508943153, 0.01971967760311144], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 503.1250000000001, 79, 1056, 517.0, 993.7, 1056.0, 1056.0, 0.08442068940045482, 0.01708612097484791, 0.057441518886491114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 134.0, 83, 243, 90.0, 243.0, 243.0, 243.0, 0.039465301543093294, 0.031063508831770694, 0.014028681407896442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1744.8571428571427, 794, 3249, 1633.0, 2957.2000000000003, 3226.7999999999997, 3249.0, 0.10355591279605895, 0.0535982751776477, 0.04763167473334353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 163.57142857142858, 160, 170, 163.0, 170.0, 170.0, 170.0, 0.03926804366606455, 0.06085779814262154, 0.08831475054975262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1f08bbd-8484-4914-a98f-9d09e0c1c4a8", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a8edfd0-b337-4488-b4a9-dc8d95dfed66", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["addBook", 57, 14, 24.56140350877193, 875.4385964912282, 409, 2213, 706.0, 1535.0, 1769.1999999999996, 2213.0, 0.288711384852276, 92.06149742439054, 1.047617513764442], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfdc6e50-775c-457d-ab0a-e86400706e83", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 150.62295081967216, 78, 332, 84.0, 319.8, 323.0, 332.0, 0.25336750333323643, 0.18829362308261027, 0.12247745522456252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68186870-fd94-49a6-87a1-1783d5a9b1a9", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 507.639344262295, 384, 711, 470.0, 630.8, 642.0, 711.0, 0.2533306754377222, 74.48762994877322, 0.12740751743205755], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 144.03278688524588, 79, 323, 87.0, 241.0, 244.9, 323.0, 0.253650909816706, 0.4488432115115931, 0.12335757137570273], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 731.27868852459, 539, 1102, 700.0, 938.4, 1010.3, 1102.0, 0.25300810040688676, 227.65713348691824, 0.1269982066495506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.05263157894737, 80, 255, 84.0, 104.0, 255.0, 255.0, 0.09511985101227546, 0.07106121682069408, 0.0338121345395198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, 8.0, 146.45714285714283, 80, 1715, 86.0, 284.6, 400.0, 844.0400000000104, 0.727911020156896, 1.6807392339360439, 0.34450257550517027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 98.61538461538463, 81, 244, 85.0, 186.79999999999995, 244.0, 244.0, 0.05631801483329868, 0.04361346265899009, 0.02001929433527414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 86.05882352941177, 80, 98, 83.0, 98.0, 98.0, 98.0, 0.111123458162018, 0.09017929075452828, 0.039500916768529834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cc091dd-7db1-4865-845d-88ceed661d4e", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e51fda6-0e26-47b7-a38a-6ba1919cdeda", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe55672-aa88-4181-9033-7f8ca61cf48b", 3, 0, 0.0, 257.3333333333333, 181, 387, 204.0, 387.0, 387.0, 387.0, 0.01822467377833937, 0.025124184066167718, 0.011687046661239764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a8edfd0-b337-4488-b4a9-dc8d95dfed66", 3, 0, 0.0, 805.3333333333334, 196, 1614, 606.0, 1614.0, 1614.0, 1614.0, 0.08685079034219212, 0.039297720890510104, 0.055695331046262515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 187.23076923076923, 159, 477, 162.0, 356.9999999999999, 477.0, 477.0, 0.05570386113455911, 0.08633010509818877, 0.12527928925086876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 255.23529411764707, 159, 938, 163.0, 570.7999999999997, 938.0, 938.0, 0.08376571223028673, 6.017061258604463, 0.18713032990140283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b875672-ea75-4024-9fcd-4c8f578524f0", 3, 0, 0.0, 276.6666666666667, 189, 451, 190.0, 451.0, 451.0, 451.0, 0.06472910868017347, 0.029288236023906615, 0.041509226595033116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b82dd66-dd49-472f-bcce-373909010ffa", 3, 0, 0.0, 468.0, 268, 609, 527.0, 609.0, 609.0, 609.0, 0.022625287529695687, 0.026742323899845395, 0.014509054828613447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 109.3125, 81, 247, 87.5, 246.3, 247.0, 247.0, 0.0879565494645645, 0.07292491259317897, 0.03126580469248191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a0a47ed-a042-4e0a-8c87-23b86c265c66", 3, 0, 0.0, 573.6666666666666, 527, 611, 583.0, 611.0, 611.0, 611.0, 0.017544270041404478, 0.024186192586376287, 0.011250720046082949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89833b90-4d86-40e6-8d06-65585f5af806", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=508e9730-b4e9-4380-9d14-a0e3031f8569", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 84.15384615384615, 80, 95, 83.0, 93.0, 95.0, 95.0, 0.06515474251346949, 0.05058400419746899, 0.023160474877834857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ed756b6-c075-473c-8c32-b2ff48b9d86d", 3, 0, 0.0, 491.6666666666667, 209, 1056, 210.0, 1056.0, 1056.0, 1056.0, 0.042372282877360494, 0.027241295144136382, 0.027172329839974012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa9feec9-cc5c-45f8-873e-e07b0adcb3fe", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 81.42105263157895, 79, 86, 81.0, 83.0, 86.0, 86.0, 0.0947054660007377, 0.07038169885406385, 0.04753770461365154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 96.15789473684211, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.09470735427528937, 0.02534161628069266, 0.05401278798512596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 104.42105263157895, 78, 236, 80.0, 235.0, 236.0, 236.0, 0.09470735427528937, 0.025526591582011586, 0.055677565696996285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 121.1578947368421, 79, 237, 81.0, 235.0, 237.0, 237.0, 0.0947054660007377, 0.025526082633011333, 0.05576894140473128], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.076923076923077, 0.6603081438004402], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.256410256410257, 0.293470286133529], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.293470286133529], "isController": false}, {"data": ["401/Unauthorized", 22, 56.41025641025641, 1.6140865737344094], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 39, "401/Unauthorized", 22, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
