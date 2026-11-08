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

    var data = {"OkPercent": 97.7743668457406, "KoPercent": 2.2256331542594014};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8096497025776602, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b5715d2-0a06-4d74-8ab5-f2a41de07dab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fe21907-3b6e-4594-9586-0e33c18222ec"], "isController": false}, {"data": [0.25, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39781579-ef81-45dc-8405-e62034fdff58"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89b99cd3-d3b0-4605-b812-bce6771dfcb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3b0bf93-cc8b-416d-90e5-58513fd95d20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/390c6dc0-f798-42da-bf59-87bdf694deba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eebf4923-0c7f-4efd-86f6-7bce8367b39f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65ebfb58-1d55-46f6-a3c2-60d974385fbd"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de53c98d-ee0d-42da-b8dc-f928a06e35b7"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3b0bf93-cc8b-416d-90e5-58513fd95d20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd85ccad-4b95-42c1-93ac-1af0ef148cba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45e6158a-98a6-4cb4-ab2c-18c83eb81060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30c4e01e-6efc-466f-ab93-284f96d76b6f"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39781579-ef81-45dc-8405-e62034fdff58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b5715d2-0a06-4d74-8ab5-f2a41de07dab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45e6158a-98a6-4cb4-ab2c-18c83eb81060"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30c4e01e-6efc-466f-ab93-284f96d76b6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89b99cd3-d3b0-4605-b812-bce6771dfcb5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=390c6dc0-f798-42da-bf59-87bdf694deba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/430f7761-893c-4c94-86f0-6ca38bf9a0f2"], "isController": false}, {"data": [0.3412698412698413, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c7c1245-50c9-450a-ab50-a04fd3d8444d"], "isController": false}, {"data": [0.6851851851851852, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9055555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c7c1245-50c9-450a-ab50-a04fd3d8444d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de53c98d-ee0d-42da-b8dc-f928a06e35b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd85ccad-4b95-42c1-93ac-1af0ef148cba"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65ebfb58-1d55-46f6-a3c2-60d974385fbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 29, 2.2256331542594014, 303.8465080583274, 95, 2005, 105.0, 802.0, 951.8, 1314.5600000000004, 5.126671676614429, 690.5563066139671, 3.7547481591392855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3b5715d2-0a06-4d74-8ab5-f2a41de07dab", 3, 0, 0.0, 347.0, 195, 538, 308.0, 538.0, 538.0, 538.0, 0.03628052098828139, 0.023324879216098878, 0.023265828888969515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fe21907-3b6e-4594-9586-0e33c18222ec", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1471.0740740740748, 1167, 2136, 1490.5, 1723.5, 1817.75, 2136.0, 0.23713540431586436, 285.35549245667886, 1.1659929304007588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39781579-ef81-45dc-8405-e62034fdff58", 3, 0, 0.0, 278.3333333333333, 192, 415, 228.0, 415.0, 415.0, 415.0, 0.06402048655569782, 0.028967602966282546, 0.04105480420401195], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 619.7857142857142, 102, 1510, 501.5, 1351.0, 1510.0, 1510.0, 0.06890950705091921, 0.01413663924642532, 0.04613033894863781], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 619.7857142857142, 102, 1510, 501.5, 1351.0, 1510.0, 1510.0, 0.06729151646238885, 0.013804711908195145, 0.04504720169430425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 168.76470588235293, 96, 303, 101.0, 300.6, 303.0, 303.0, 0.1009273441859913, 0.027005949518517203, 0.05756012598107316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 112.88235294117646, 98, 302, 102.0, 144.39999999999986, 302.0, 302.0, 0.10093034025398823, 0.07500780169266118, 0.05066229969780269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 146.64705882352942, 97, 304, 101.0, 301.6, 304.0, 304.0, 0.10092914180544424, 0.02720355775224864, 0.05943385987176062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89b99cd3-d3b0-4605-b812-bce6771dfcb5", 3, 0, 0.0, 404.33333333333337, 198, 811, 204.0, 811.0, 811.0, 811.0, 0.020390685534847682, 0.024101099992523415, 0.01307605810665688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 122.47058823529412, 96, 291, 101.0, 290.2, 291.0, 291.0, 0.1009321379801698, 0.02720436531496764, 0.05933705767974826], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 185.00000000000003, 100, 274, 199.0, 250.5, 274.0, 274.0, 0.06876970989006671, 0.1372180211638782, 0.044444151934393696], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 112.33333333333333, 97, 305, 102.0, 125.00000000000028, 305.0, 305.0, 0.12065313564093627, 0.08966507443628174, 0.060562218476016845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3b0bf93-cc8b-416d-90e5-58513fd95d20", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 145.5, 96, 312, 101.5, 307.5, 312.0, 312.0, 0.12065717943733537, 0.04235307893660806, 0.06824933554761602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 634.4, 499, 781, 676.0, 781.0, 781.0, 781.0, 0.04107585889620952, 12.077666362363011, 0.023426075776744493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 834.8, 686, 1011, 879.0, 1011.0, 1011.0, 1011.0, 0.041079233625817474, 36.96316662610093, 0.023387883988136317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 185.0, 97, 315, 105.0, 315.0, 315.0, 315.0, 0.04120992334954257, 0.07292224717712026, 0.022818385292178358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 120.61904761904762, 97, 301, 102.0, 262.8000000000001, 301.0, 301.0, 0.09816157395072288, 0.0729501540786134, 0.04927250879948395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/390c6dc0-f798-42da-bf59-87bdf694deba", 3, 0, 0.0, 626.3333333333333, 227, 1345, 307.0, 1345.0, 1345.0, 1345.0, 0.09251264339459726, 0.04185956195263353, 0.059326141760207236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 138.66666666666666, 95, 308, 101.0, 303.4, 307.6, 308.0, 0.09816340935544036, 0.03328718289712942, 0.055591238798853825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 166.66666666666669, 97, 902, 102.0, 302.2, 842.1999999999991, 902.0, 0.09816524482879514, 4.231353898854739, 0.057308709243893884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 137.8571428571429, 96, 500, 101.0, 296.4, 479.7999999999997, 500.0, 0.09816432708353784, 1.3996542190794057, 0.05740403706638246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 141.8, 98, 306, 102.0, 306.0, 306.0, 306.0, 0.04128273721060801, 0.03067984669655537, 0.023181224507909774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 697.2307692307693, 101, 1076, 863.0, 1044.0, 1076.0, 1076.0, 0.22830248322854835, 158.0349508600857, 0.11912477828316533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 170.05555555555557, 97, 666, 101.0, 416.7000000000004, 666.0, 666.0, 0.12065717943733537, 6.062244284285073, 0.0703571703880469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 547.1538461538463, 101, 900, 501.0, 859.1999999999999, 900.0, 900.0, 0.22791023842917252, 51.562773930575034, 0.11914267947931277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 134.22222222222223, 97, 497, 101.0, 324.2000000000003, 497.0, 497.0, 0.12065717943733537, 2.0016706620392406, 0.07047499966484116], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 445.7692307692308, 103, 1413, 425.0, 1048.1999999999998, 1413.0, 1413.0, 0.06404414119269897, 0.012696250646599502, 0.04345302608567135], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 309.04761904761904, 196, 1004, 205.0, 608.0, 964.5999999999995, 1004.0, 0.09811479430934193, 5.734313313243161, 0.21946706292195203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eebf4923-0c7f-4efd-86f6-7bce8367b39f", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65ebfb58-1d55-46f6-a3c2-60d974385fbd", 3, 0, 0.0, 318.6666666666667, 202, 464, 290.0, 464.0, 464.0, 464.0, 0.02010548678734427, 0.02771703663554784, 0.012893166982769598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 330.0, 132, 797, 297.0, 558.0, 797.0, 797.0, 0.09671672181216595, 0.059409001972512095, 0.043730314647493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 115.84615384615384, 97, 295, 102.0, 218.59999999999994, 295.0, 295.0, 0.2307255430924322, 0.17146693192709073, 0.11581340737256851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 207.30769230769232, 97, 308, 290.0, 306.0, 308.0, 308.0, 0.22990945104697227, 0.3271442924978778, 0.11626730952886248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de53c98d-ee0d-42da-b8dc-f928a06e35b7", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["login", 19, 0, 0.0, 1832.9999999999998, 1222, 2855, 1731.0, 2413.0, 2855.0, 2855.0, 0.09686760747206134, 30.629098352167283, 0.18842283124898035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3b0bf93-cc8b-416d-90e5-58513fd95d20", 3, 0, 0.0, 378.66666666666663, 192, 752, 192.0, 752.0, 752.0, 752.0, 0.017453428435125606, 0.024060960098553692, 0.011192465500389794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 117.66666666666669, 99, 349, 104.0, 134.80000000000035, 349.0, 349.0, 0.11709221011546593, 0.09479437713449342, 0.04162262156448203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd85ccad-4b95-42c1-93ac-1af0ef148cba", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45e6158a-98a6-4cb4-ab2c-18c83eb81060", 3, 0, 0.0, 324.6666666666667, 201, 570, 203.0, 570.0, 570.0, 570.0, 0.02622927886969294, 0.026306122460131497, 0.01682020812932783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30c4e01e-6efc-466f-ab93-284f96d76b6f", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 837.6153846153846, 205, 1175, 963.0, 1144.6, 1175.0, 1175.0, 0.22749943125142189, 209.44168098564128, 0.46687627421556444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 318.82352941176475, 200, 593, 393.0, 443.39999999999986, 593.0, 593.0, 0.10086626320161386, 0.15632300752046993, 0.22685058999347338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 599.3333333333334, 100, 1185, 815.0, 1185.0, 1185.0, 1185.0, 0.056799177043034846, 37.75762272566629, 0.08766400762371176], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 858.0952380952384, 153, 2005, 859.0, 1422.4, 1946.7999999999993, 2005.0, 0.08803591865481117, 0.027805987700124508, 0.03971933048683863], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 306.9444444444444, 201, 765, 206.0, 626.4000000000002, 765.0, 765.0, 0.12057231659610952, 8.190171587384786, 0.26945610162906597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 139.99999999999997, 98, 311, 103.0, 306.8, 311.0, 311.0, 0.11999760004799903, 0.09316219925601488, 0.04265539689206215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39781579-ef81-45dc-8405-e62034fdff58", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 348.15384615384613, 200, 476, 402.0, 449.2, 476.0, 476.0, 0.1046850590262679, 0.16224139519012418, 0.23543915130614743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 121.50000000000001, 98, 305, 102.0, 284.9000000000001, 305.0, 305.0, 0.050008251361474645, 0.03716433524031465, 0.0251017980466777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 121.9, 99, 308, 101.0, 287.5000000000001, 308.0, 308.0, 0.050008251361474645, 0.013381114133832082, 0.028520330854591006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 140.60000000000002, 96, 307, 101.0, 306.1, 307.0, 307.0, 0.050007251051402454, 0.013478516884948317, 0.029398794075140896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 120.3, 97, 290, 101.5, 271.4000000000001, 290.0, 290.0, 0.050007751201436225, 0.013478651691012108, 0.029447923803189495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 4.415011037527594, 1.3020833333333333, 2.729201158940397], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 976.2037037037036, 762, 1714, 864.5, 1309.5, 1398.25, 1714.0, 0.2334549604855863, 279.29329481686756, 0.4609823536150933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 858.0952380952384, 153, 2005, 859.0, 1422.4, 1946.7999999999993, 2005.0, 0.08696624467331751, 0.027468133083201847, 0.03923672367096942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 100.11111111111111, 96, 103, 101.0, 103.0, 103.0, 103.0, 0.05970862192500597, 0.016093339503224266, 0.035160448262479105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 100.55555555555556, 96, 102, 102.0, 102.0, 102.0, 102.0, 0.05971020646462502, 0.01609376658616846, 0.03510307059736744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 215.375, 97, 952, 100.5, 915.6, 952.0, 952.0, 0.1182583501481925, 13.329023948239799, 0.0682526220093572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 226.37499999999997, 96, 742, 101.0, 716.8000000000001, 742.0, 742.0, 0.1182583501481925, 4.37437521711494, 0.06836810867942379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 113.87499999999999, 97, 296, 102.0, 161.60000000000014, 296.0, 296.0, 0.1184211500173931, 0.08800634293284781, 0.05944186631732428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 120.88888888888889, 96, 293, 101.0, 293.0, 293.0, 293.0, 0.05970941418430306, 0.015976933092284217, 0.03405302527698534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 124.3125, 96, 299, 101.0, 294.8, 299.0, 299.0, 0.11842377949492258, 0.053920983583503564, 0.06629534335494568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 100.33333333333333, 98, 104, 100.0, 104.0, 104.0, 104.0, 0.05970941418430306, 0.044373890814701784, 0.029971327041730247], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 566.25, 101, 1345, 489.5, 1184.8000000000006, 1345.0, 1345.0, 0.05911126217322556, 0.011107414091632307, 0.04023010136349978], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 125.66666666666667, 98, 306, 103.0, 306.0, 306.0, 306.0, 0.05793407102717108, 0.04560045043740224, 0.020593751810439723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b5715d2-0a06-4d74-8ab5-f2a41de07dab", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45e6158a-98a6-4cb4-ab2c-18c83eb81060", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 983.2631578947369, 741, 1432, 961.0, 1215.0, 1432.0, 1432.0, 0.09731363159107788, 0.050367406975850855, 0.0447604692181618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c4e01e-6efc-466f-ab93-284f96d76b6f", 3, 0, 0.0, 403.0, 274, 478, 457.0, 478.0, 478.0, 478.0, 0.02817351126470892, 0.028256050848492247, 0.01806699778368378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 223.55555555555554, 195, 391, 204.0, 391.0, 391.0, 391.0, 0.05966824456024504, 0.09247412511436413, 0.13419528049047297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89b99cd3-d3b0-4605-b812-bce6771dfcb5", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=390c6dc0-f798-42da-bf59-87bdf694deba", 1, 0, 0.0, 1413.0, 1413, 1413, 1413.0, 1413.0, 1413.0, 1413.0, 0.7077140835102619, 0.12785850141542818, 0.487935686482661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/430f7761-893c-4c94-86f0-6ca38bf9a0f2", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 917.7301587301587, 504, 2094, 813.0, 1438.2, 1762.3999999999999, 2094.0, 0.30988229391597766, 83.56445932149305, 1.1288377139048613], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 188.29629629629628, 97, 459, 103.0, 407.5, 410.0, 459.0, 0.23432719887870096, 0.17414355307294085, 0.1132734018017158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c7c1245-50c9-450a-ab50-a04fd3d8444d", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 591.4074074074074, 475, 950, 504.0, 799.5, 905.75, 950.0, 0.23427738442315701, 68.88532976168784, 0.11782505173625572], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 161.81481481481478, 97, 347, 103.0, 303.5, 313.5, 347.0, 0.2344838966012862, 0.4149265826577447, 0.11403611377679738], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 778.1111111111109, 663, 1303, 703.0, 908.5, 968.75, 1303.0, 0.2339090093953452, 210.4717378221122, 0.11741135823164789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 104.99999999999999, 102, 119, 104.0, 113.8, 119.0, 119.0, 0.10404494741728428, 0.07772889138107662, 0.036984727402237766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 15, 8.333333333333334, 152.9055555555555, 97, 908, 104.0, 251.30000000000004, 308.95, 886.1299999999999, 0.7627926687149063, 1.5483962813857401, 0.3697053117385316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 103.2, 100, 105, 103.5, 105.0, 105.0, 105.0, 0.050669085271003604, 0.039238852167876814, 0.01801127640492706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c7c1245-50c9-450a-ab50-a04fd3d8444d", 3, 0, 0.0, 352.0, 200, 436, 420.0, 436.0, 436.0, 436.0, 0.026944978354200722, 0.027023918720472797, 0.017279169061775856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 103.05882352941175, 98, 110, 103.0, 109.2, 110.0, 110.0, 0.10556580164806845, 0.08566912223588367, 0.03752534355458683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de53c98d-ee0d-42da-b8dc-f928a06e35b7", 3, 0, 0.0, 634.3333333333334, 201, 1187, 515.0, 1187.0, 1187.0, 1187.0, 0.02355083840984739, 0.02361983500675124, 0.015102588433398229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd85ccad-4b95-42c1-93ac-1af0ef148cba", 3, 0, 0.0, 268.6666666666667, 195, 407, 204.0, 407.0, 407.0, 407.0, 0.019213772432079314, 0.0264877364094583, 0.012321331930727946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 283.9, 203, 614, 205.5, 592.4000000000001, 614.0, 614.0, 0.049982506122857, 0.07746312228220123, 0.11241182773529265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 367.75, 199, 1196, 206.0, 1096.6000000000001, 1196.0, 1196.0, 0.11816664451042082, 17.83129184299346, 0.26198029755838176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 113.23809523809521, 99, 304, 104.0, 115.0, 285.2999999999997, 304.0, 0.1006098875564733, 0.08341581497602131, 0.035763670967340115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65ebfb58-1d55-46f6-a3c2-60d974385fbd", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 108.92307692307692, 99, 168, 103.0, 145.99999999999997, 168.0, 168.0, 0.237005706368161, 0.18400345367450002, 0.08424812218555724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 106.6923076923077, 96, 169, 102.0, 143.39999999999998, 169.0, 169.0, 0.10477280420380729, 0.07786338281161849, 0.0525910364851142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 161.0769230769231, 96, 306, 100.0, 303.6, 306.0, 306.0, 0.10477618195592953, 0.028035814312426455, 0.05975516627174106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 177.76923076923077, 97, 306, 101.0, 305.6, 306.0, 306.0, 0.10477787091366303, 0.02824091051969824, 0.06159792801760268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 223.30769230769232, 97, 306, 297.0, 305.6, 306.0, 306.0, 0.10477280420380729, 0.02823954488305743, 0.06169726653798417], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 17.24137931034483, 0.3837298541826554], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.23023791250959325], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07674597083653108], "isController": false}, {"data": ["401/Unauthorized", 20, 68.96551724137932, 1.5349194167306217], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 29, "401/Unauthorized", 20, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
